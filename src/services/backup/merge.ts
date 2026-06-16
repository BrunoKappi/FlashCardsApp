import { db, type Card, type Deck, type StudySession, type UserStats } from '../db';
import { v4 as uuidv4 } from 'uuid';

export type MergeStrategy = 'overwrite' | 'merge' | 'duplicate' | 'ignore';

export interface MergeConflictReport {
  decksInConflict: { id: string; localName: string; importedName: string }[];
  cardsInConflict: { id: string; localQuestion: string; importedQuestion: string }[];
  summary: {
    totalDecksToImport: number;
    totalCardsToImport: number;
    deckConflictsCount: number;
    cardConflictsCount: number;
  };
}

/**
 * Scan database and backup payload to find conflicting records
 */
export async function analyzeConflicts(
  importedDecks: Deck[],
  importedCards: Card[]
): Promise<MergeConflictReport> {
  const decksInConflict: MergeConflictReport['decksInConflict'] = [];
  const cardsInConflict: MergeConflictReport['cardsInConflict'] = [];

  for (const deck of importedDecks) {
    const localDeck = await db.decks.get(deck.Id);
    if (localDeck) {
      decksInConflict.push({
        id: deck.Id,
        localName: localDeck.Name,
        importedName: deck.Name
      });
    }
  }

  for (const card of importedCards) {
    const localCard = await db.cards.get(card.Id);
    if (localCard) {
      cardsInConflict.push({
        id: card.Id,
        localQuestion: localCard.Question,
        importedQuestion: card.Question
      });
    }
  }

  return {
    decksInConflict,
    cardsInConflict,
    summary: {
      totalDecksToImport: importedDecks.length,
      totalCardsToImport: importedCards.length,
      deckConflictsCount: decksInConflict.length,
      cardConflictsCount: cardsInConflict.length
    }
  };
}

/**
 * Executes the data merge using the chosen strategy
 */
export async function executeMerge(params: {
  importedDecks: Deck[];
  importedCards: Card[];
  importedSessions: StudySession[];
  importedStats?: UserStats;
  strategy: MergeStrategy;
  onProgress?: (progress: number) => void;
}): Promise<{ importedDecksCount: number; importedCardsCount: number; xpGained: number }> {
  const { importedDecks, importedCards, importedSessions, importedStats, strategy, onProgress } = params;

  let decksImported = 0;
  let cardsImported = 0;
  let totalSteps = importedDecks.length + importedCards.length + importedSessions.length + (importedStats ? 1 : 0);
  let currentStep = 0;

  const updateProgress = () => {
    currentStep++;
    if (onProgress) {
      onProgress(Math.min(100, Math.round((currentStep / totalSteps) * 100)));
    }
  };

  // Maps to track ID updates in case of 'duplicate' strategy
  const deckIdMap = new Map<string, string>(); // oldId -> newId
  const cardIdMap = new Map<string, string>(); // oldId -> newId

  // --- 1. MERGE DECKS ---
  for (const deck of importedDecks) {
    const existingDeck = await db.decks.get(deck.Id);

    if (existingDeck) {
      if (strategy === 'overwrite') {
        // Overwrite: update local deck metadata
        await db.decks.put(deck);
        deckIdMap.set(deck.Id, deck.Id);
        decksImported++;
      } else if (strategy === 'merge') {
        // Merge: Keep local deck but map ID for cards compatibility
        deckIdMap.set(deck.Id, deck.Id);
        decksImported++;
      } else if (strategy === 'duplicate') {
        // Duplicate: Create a new deck with a new ID
        const newId = uuidv4();
        const duplicatedDeck: Deck = {
          ...deck,
          Id: newId,
          Name: `${deck.Name} (Cópia)`,
          CreatedAt: Date.now()
        };
        await db.decks.add(duplicatedDeck);
        deckIdMap.set(deck.Id, newId);
        decksImported++;
      } else if (strategy === 'ignore') {
        // Ignore: Skip
        deckIdMap.set(deck.Id, deck.Id);
      }
    } else {
      // No conflict, import directly
      await db.decks.add(deck);
      deckIdMap.set(deck.Id, deck.Id);
      decksImported++;
    }
    updateProgress();
  }

  // --- 2. MERGE CARDS ---
  for (const card of importedCards) {
    // Determine target deck ID (might have been updated by 'duplicate' strategy)
    const targetDeckId = deckIdMap.get(card.DeckId) || card.DeckId;
    
    // Check if target deck exists (or is imported)
    let deckExists = deckIdMap.has(card.DeckId);
    if (!deckExists) {
      const dbDeck = await db.decks.get(targetDeckId);
      deckExists = dbDeck !== undefined;
    }
    if (!deckExists) {
      // If deck does not exist, discard card or assign to default?
      // Let's create a fallback deck if deck was not imported
      const fallbackDeckId = uuidv4();
      await db.decks.add({
        Id: fallbackDeckId,
        Name: 'Restaurados sem Categoria',
        Index: 999,
        CreatedAt: Date.now()
      });
      deckIdMap.set(card.DeckId, fallbackDeckId);
    }

    const finalDeckId = deckIdMap.get(card.DeckId) || card.DeckId;
    const finalCard: Card = {
      ...card,
      DeckId: finalDeckId
    };

    const existingCard = await db.cards.get(card.Id);

    if (existingCard) {
      if (strategy === 'overwrite') {
        await db.cards.put(finalCard);
        cardIdMap.set(card.Id, card.Id);
        cardsImported++;
      } else if (strategy === 'merge') {
        // Merge: Smart combination of metrics.
        // Accumulate correct and wrong counts
        const mergedCard: Card = {
          ...existingCard,
          CorrectCount: existingCard.CorrectCount + card.CorrectCount,
          WrongCount: existingCard.WrongCount + card.WrongCount,
          Favorite: existingCard.Favorite || card.Favorite,
          // Spaced Repetition values: Keep the version with more reviews (higher Repetitions) or more recent review date
          Interval: card.Repetitions > existingCard.Repetitions ? card.Interval : existingCard.Interval,
          EaseFactor: card.Repetitions > existingCard.Repetitions ? card.EaseFactor : existingCard.EaseFactor,
          Repetitions: Math.max(card.Repetitions, existingCard.Repetitions),
          NextReview: card.NextReview > existingCard.NextReview ? card.NextReview : existingCard.NextReview,
          LastReview: card.LastReview && existingCard.LastReview 
            ? Math.max(card.LastReview, existingCard.LastReview) 
            : (card.LastReview || existingCard.LastReview)
        };
        await db.cards.put(mergedCard);
        cardIdMap.set(card.Id, card.Id);
        cardsImported++;
      } else if (strategy === 'duplicate') {
        const newCardId = uuidv4();
        const duplicatedCard: Card = {
          ...finalCard,
          Id: newCardId,
          CreatedAt: Date.now()
        };
        await db.cards.add(duplicatedCard);
        cardIdMap.set(card.Id, newCardId);
        cardsImported++;
      } else if (strategy === 'ignore') {
        // Ignore conflict, keep local card
        cardIdMap.set(card.Id, card.Id);
      }
    } else {
      // No conflict, save card
      await db.cards.add(finalCard);
      cardIdMap.set(card.Id, card.Id);
      cardsImported++;
    }
    updateProgress();
  }

  // --- 3. IMPORT STUDY SESSIONS ---
  for (const session of importedSessions) {
    const mappedDeckId = deckIdMap.get(session.DeckId) || session.DeckId;
    const mappedDeck = await db.decks.get(mappedDeckId);
    
    // Validate study session exists, prevent exact duplicate session imports
    const existingSession = await db.studySessions.get(session.Id);
    if (!existingSession) {
      const finalSession: StudySession = {
        ...session,
        DeckId: mappedDeckId,
        DeckName: mappedDeck ? mappedDeck.Name : session.DeckName
      };
      await db.studySessions.add(finalSession);
    } else if (strategy === 'duplicate') {
      const finalSession: StudySession = {
        ...session,
        Id: uuidv4(),
        DeckId: mappedDeckId,
        DeckName: mappedDeck ? mappedDeck.Name : session.DeckName
      };
      await db.studySessions.add(finalSession);
    }
    updateProgress();
  }

  // --- 4. MERGE USER STATS ---
  let xpGained = 0;
  if (importedStats) {
    const localStats = await db.userStats.get('current');
    if (localStats) {
      // Intelligent combination:
      // XP: Sum them up or take max. Let's merge XP and recalculate Level accordingly.
      // Streaks: Take the maximum streak.
      // Achievements: Merge unique lists.
      // WeeklyProgress: Combine daily XP records.
      const mergedAchievements = Array.from(new Set([...localStats.Achievements, ...importedStats.Achievements]));
      
      const mergedWeeklyProgress = { ...localStats.WeeklyProgress };
      for (const [dateStr, xp] of Object.entries(importedStats.WeeklyProgress)) {
        mergedWeeklyProgress[dateStr] = (mergedWeeklyProgress[dateStr] || 0) + xp;
      }

      const mergedXp = localStats.Xp + importedStats.Xp;
      const calculatedLevel = Math.floor(Math.sqrt(mergedXp / 100)) + 1;
      xpGained = importedStats.Xp;

      const mergedStats: UserStats = {
        Id: 'current',
        Streak: Math.max(localStats.Streak, importedStats.Streak),
        LastActiveDate: localStats.LastActiveDate && importedStats.LastActiveDate
          ? (localStats.LastActiveDate > importedStats.LastActiveDate ? localStats.LastActiveDate : importedStats.LastActiveDate)
          : (localStats.LastActiveDate || importedStats.LastActiveDate),
        Xp: mergedXp,
        Level: Math.max(localStats.Level, calculatedLevel),
        Achievements: mergedAchievements,
        WeeklyProgress: mergedWeeklyProgress
      };

      await db.userStats.put(mergedStats);
    } else {
      await db.userStats.put(importedStats);
    }
    updateProgress();
  }

  return {
    importedDecksCount: decksImported,
    importedCardsCount: cardsImported,
    xpGained
  };
}
