import { db } from './db';

export async function migrateLocalStorageToDexie() {
  const isMigrated = localStorage.getItem('FlashCardsMigrated');
  if (isMigrated === 'true') return;

  try {
    // 1. Migração de Categorias e Cards
    const localCategories = localStorage.getItem('FlashCardsCategories');
    if (localCategories) {
      const parsed = JSON.parse(localCategories);
      if (Array.isArray(parsed)) {
        for (const cat of parsed) {
          // Salva o deck no Dexie
          const deckExists = await db.decks.get(cat.Id);
          if (!deckExists) {
            await db.decks.add({
              Id: cat.Id,
              Name: cat.Name,
              Index: cat.Index ?? 1,
              CreatedAt: Date.now()
            });
          }

          // Salva os cards do deck no Dexie
          if (Array.isArray(cat.Cards)) {
            for (const c of cat.Cards) {
              const cardExists = await db.cards.get(c.Id);
              if (!cardExists) {
                await db.cards.add({
                  Id: c.Id,
                  DeckId: cat.Id,
                  Type: c.Type || 'Text',
                  Question: c.Question || '',
                  Answer: c.Answer || { Id: 1, Option: '', IsAnswer: true },
                  Options: c.Options || [],
                  Interval: 0,
                  EaseFactor: 2.5,
                  Repetitions: 0,
                  NextReview: Date.now(),
                  CorrectCount: 0,
                  WrongCount: 0,
                  Favorite: false,
                  CreatedAt: Date.now()
                });
              }
            }
          }
        }
      }
    }

    // 2. Migração de Estatísticas do Usuário (se existirem)
    const localUserInfo = localStorage.getItem('FlashCardsUserInfo');
    if (localUserInfo) {
      const parsedUser = JSON.parse(localUserInfo);
      if (parsedUser) {
        let xpGained = 0;
        
        // Se houver registros de rodadas jogadas no antigo Redux, converte para XP e sessões de estudo
        if (Array.isArray(parsedUser.Rounds)) {
          xpGained += parsedUser.Rounds.length * 20; // 20 XP por rodada legada

          for (const round of parsedUser.Rounds) {
            const date = new Date(round.Date || Date.now()).toISOString().split('T')[0];
            await db.studySessions.add({
              Id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
              DeckId: round.CategoryId || 'trivia',
              DeckName: round.Category || 'Trivia',
              Date: date,
              Timestamp: round.Timestamp || Date.now(),
              Duration: round.Duration || 120, // 2 min default
              CardsReviewed: round.AnswersCount || 10,
              CorrectCount: round.Score || 0,
              WrongCount: Math.max(0, (round.AnswersCount || 10) - (round.Score || 0)),
              XpGained: 20
            });
          }
        }

        const statsExists = await db.userStats.get('current');
        if (!statsExists) {
          const calculatedLevel = Math.floor(Math.sqrt(xpGained / 100)) + 1;
          await db.userStats.put({
            Id: 'current',
            Streak: 0,
            Xp: xpGained,
            Level: calculatedLevel,
            Achievements: [],
            WeeklyProgress: {}
          });
        }
      }
    }

    // Sinalizar migração concluída
    localStorage.setItem('FlashCardsMigrated', 'true');
    console.log('IndexedDB migration successfully completed!');
  } catch (error) {
    console.error('Error during LocalStorage migration to IndexedDB:', error);
  }
}
