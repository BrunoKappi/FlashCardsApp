import { create } from 'zustand';
import { db, type Card, type Deck, type StudySession, type UserStats, type Option } from '../services/db';
import { calculateSM2 } from '../utils/sm2';
import { v4 as uuidv4 } from 'uuid';

interface StudyRoundCard {
  cardId: string;
  question: string;
  isCorrect: boolean;
  quality: number;
}

interface StudyRound {
  id: string;
  deckId: string;
  deckName: string;
  timestamp: number;
  cards: StudyRoundCard[];
}

interface AppState {
  decks: Deck[];
  cards: Card[];
  studySessions: StudySession[];
  userStats: UserStats;
  currentDeckId: string | null;
  playing: boolean;
  isLoading: boolean;
  studyRounds: StudyRound[]; // Histórico local de rodadas de estudo rápidas

  // Ações de inicialização
  syncFromDB: () => Promise<void>;
  
  // Ações de Decks (Categorias)
  addDeck: (name: string) => Promise<void>;
  editDeck: (id: string, name: string) => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  reorderDecks: (orderedDecks: Deck[]) => Promise<void>;

  // Ações de Cards (Flashcards)
  addCard: (deckId: string, question: string, answerText: string, type: 'Text' | 'MultipleChoice', options?: Option[]) => Promise<void>;
  editCard: (cardId: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  toggleFavoriteCard: (cardId: string) => Promise<void>;

  // Ações de Estudo & SM-2
  recordCardReview: (cardId: string, quality: number) => Promise<void>;
  addStudySession: (session: Omit<StudySession, 'Id' | 'Timestamp'>) => Promise<void>;

  // Níveis & Gamificação
  addXP: (amount: number) => Promise<void>;
  checkAchievements: () => Promise<string[]>;

  // Navegação & Controles de Jogo
  setCurrentDeckId: (id: string | null) => void;
  setPlaying: (playing: boolean) => void;
  addStudyRound: (round: Omit<StudyRound, 'id' | 'timestamp'>) => void;

  // Utilitários
  clearAllData: () => Promise<void>;
}

const DEFAULT_STATS: UserStats = {
  Id: 'current',
  Streak: 0,
  Xp: 0,
  Level: 1,
  Achievements: [],
  WeeklyProgress: {}
};

export const useStore = create<AppState>((set, get) => ({
  decks: [],
  cards: [],
  studySessions: [],
  userStats: DEFAULT_STATS,
  currentDeckId: null,
  playing: false,
  isLoading: true,
  studyRounds: [],

  syncFromDB: async () => {
    set({ isLoading: true });
    try {
      const decks = await db.decks.toArray();
      const cards = await db.cards.toArray();
      const studySessions = await db.studySessions.toArray();
      
      let stats = await db.userStats.get('current');
      if (!stats) {
        stats = { ...DEFAULT_STATS };
        await db.userStats.put(stats);
      }

      // Ordenar decks pelo Index
      decks.sort((a, b) => a.Index - b.Index);

      set({
        decks,
        cards,
        studySessions,
        userStats: stats,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to sync with IndexedDB:', error);
      set({ isLoading: false });
    }
  },

  addDeck: async (name: string) => {
    const { decks } = get();
    const newIndex = decks.length > 0 ? Math.max(...decks.map(d => d.Index)) + 1 : 1;
    const newDeck: Deck = {
      Id: uuidv4(),
      Name: name,
      Index: newIndex,
      CreatedAt: Date.now()
    };
    await db.decks.add(newDeck);
    await get().syncFromDB();
    await get().addXP(15); // XP por criar uma categoria
  },

  editDeck: async (id: string, name: string) => {
    await db.decks.update(id, { Name: name });
    await get().syncFromDB();
  },

  deleteDeck: async (id: string) => {
    // Apaga o deck
    await db.decks.delete(id);
    // Apaga todos os cards associados
    const cards = await db.cards.where('DeckId').equals(id).toArray();
    const cardIds = cards.map(c => c.Id);
    await db.cards.bulkDelete(cardIds);
    await get().syncFromDB();
  },

  reorderDecks: async (orderedDecks: Deck[]) => {
    const updates = orderedDecks.map((deck, idx) => {
      deck.Index = idx + 1;
      return db.decks.update(deck.Id, { Index: idx + 1 });
    });
    await Promise.all(updates);
    await get().syncFromDB();
  },

  addCard: async (deckId: string, question: string, answerText: string, type: 'Text' | 'MultipleChoice', options: Option[] = []) => {
    // Se for tipo texto, criamos uma opção de resposta simples
    let answerOption: Option = { Id: uuidv4(), Option: answerText, IsAnswer: true };
    
    if (type === 'MultipleChoice') {
      const correctOpt = options.find(o => o.IsAnswer);
      if (correctOpt) {
        answerOption = correctOpt;
      }
    } else {
      options = [answerOption];
    }

    const newCard: Card = {
      Id: uuidv4(),
      DeckId: deckId,
      Type: type,
      Question: question,
      Answer: answerOption,
      Options: options,
      Interval: 0,
      EaseFactor: 2.5,
      Repetitions: 0,
      NextReview: Date.now(),
      CorrectCount: 0,
      WrongCount: 0,
      Favorite: false,
      CreatedAt: Date.now()
    };

    await db.cards.add(newCard);
    await get().syncFromDB();
    await get().addXP(5); // XP por criar um card
  },

  editCard: async (cardId: string, updates: Partial<Card>) => {
    await db.cards.update(cardId, updates);
    await get().syncFromDB();
  },

  deleteCard: async (cardId: string) => {
    await db.cards.delete(cardId);
    await get().syncFromDB();
  },

  toggleFavoriteCard: async (cardId: string) => {
    const card = await db.cards.get(cardId);
    if (card) {
      await db.cards.update(cardId, { Favorite: !card.Favorite });
      await get().syncFromDB();
    }
  },

  recordCardReview: async (cardId: string, quality: number) => {
    const card = await db.cards.get(cardId);
    if (!card) return;

    // Calcular novo estado do SM-2
    const sm2Result = calculateSM2(quality, card.Repetitions, card.Interval, card.EaseFactor);
    
    const isCorrect = quality >= 3;
    const updates: Partial<Card> = {
      Interval: sm2Result.interval,
      EaseFactor: sm2Result.easeFactor,
      Repetitions: sm2Result.repetitions,
      NextReview: sm2Result.nextReview,
      LastReview: Date.now(),
      CorrectCount: card.CorrectCount + (isCorrect ? 1 : 0),
      WrongCount: card.WrongCount + (isCorrect ? 0 : 1)
    };

    await db.cards.update(cardId, updates);

    // Conceder XP com base na resposta
    const xpReward = isCorrect ? (quality === 5 ? 15 : 10) : 3;
    await get().addXP(xpReward);
    await get().syncFromDB();
  },

  addStudySession: async (session: Omit<StudySession, 'Id' | 'Timestamp'>) => {
    const newSession: StudySession = {
      ...session,
      Id: uuidv4(),
      Timestamp: Date.now()
    };

    await db.studySessions.add(newSession);

    // Atualizar streak e atividade do usuário
    const stats = { ...get().userStats };
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (stats.LastActiveDate !== todayStr) {
      // Se estudou ontem, incrementa o streak
      if (stats.LastActiveDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (stats.LastActiveDate === yesterdayStr) {
          stats.Streak += 1;
        } else {
          stats.Streak = 1;
        }
      } else {
        stats.Streak = 1;
      }
      stats.LastActiveDate = todayStr;
    }

    // Registrar progresso diário de XP
    const currentDayXp = stats.WeeklyProgress[todayStr] || 0;
    stats.WeeklyProgress[todayStr] = currentDayXp + session.XpGained;

    await db.userStats.put(stats);
    
    // Sincronizar dados e verificar conquistas destravadas
    await get().syncFromDB();
    await get().checkAchievements();
  },

  addXP: async (amount: number) => {
    const stats = { ...get().userStats };
    stats.Xp += amount;

    // Calcular nível (XP necessário aumenta a cada nível)
    // Fórmula simples: Level = floor(sqrt(XP / 100)) + 1
    const nextLevel = Math.floor(Math.sqrt(stats.Xp / 100)) + 1;
    if (nextLevel > stats.Level) {
      stats.Level = nextLevel;
      // Conceder bônus de nível
    }

    // Registrar progresso diário
    const todayStr = new Date().toISOString().split('T')[0];
    stats.WeeklyProgress[todayStr] = (stats.WeeklyProgress[todayStr] || 0) + amount;

    await db.userStats.put(stats);
    set({ userStats: stats });
  },

  checkAchievements: async () => {
    const stats = { ...get().userStats };
    const decks = await db.decks.toArray();
    const cards = await db.cards.toArray();
    const sessions = await db.studySessions.toArray();

    const newAchievements: string[] = [...stats.Achievements];

    // Regras das Conquistas
    if (decks.length >= 1 && !newAchievements.includes('first_deck')) {
      newAchievements.push('first_deck');
    }
    if (cards.length >= 20 && !newAchievements.includes('card_collector')) {
      newAchievements.push('card_collector');
    }
    if (stats.Streak >= 3 && !newAchievements.includes('streak_3')) {
      newAchievements.push('streak_3');
    }
    if (stats.Streak >= 7 && !newAchievements.includes('streak_7')) {
      newAchievements.push('streak_7');
    }
    const totalReviews = cards.reduce((acc, c) => acc + c.CorrectCount + c.WrongCount, 0);
    if (totalReviews >= 50 && !newAchievements.includes('reviewed_50')) {
      newAchievements.push('reviewed_50');
    }
    if (totalReviews >= 200 && !newAchievements.includes('reviewed_200')) {
      newAchievements.push('reviewed_200');
    }
    const hasPerfectSession = sessions.some(s => s.CardsReviewed >= 10 && s.WrongCount === 0);
    if (hasPerfectSession && !newAchievements.includes('perfect_session')) {
      newAchievements.push('perfect_session');
    }

    if (newAchievements.length > stats.Achievements.length) {
      stats.Achievements = newAchievements;
      await db.userStats.put(stats);
      set({ userStats: stats });
    }

    return newAchievements;
  },

  setCurrentDeckId: (id) => set({ currentDeckId: id }),
  setPlaying: (playing) => set({ playing }),

  addStudyRound: (round) => {
    const newRound: StudyRound = {
      ...round,
      id: uuidv4(),
      timestamp: Date.now()
    };
    set(state => ({ studyRounds: [newRound, ...state.studyRounds].slice(0, 50) })); // Limita a 50 rodadas recentes
  },

  clearAllData: async () => {
    await db.decks.clear();
    await db.cards.clear();
    await db.studySessions.clear();
    await db.userStats.clear();
    set({
      decks: [],
      cards: [],
      studySessions: [],
      userStats: { ...DEFAULT_STATS },
      currentDeckId: null,
      playing: false
    });
  }
}));
