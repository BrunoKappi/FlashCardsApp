import Dexie, { type Table } from 'dexie';

export interface Option {
  Id: number | string;
  Option: string;
  IsAnswer: boolean;
}

export interface Card {
  Id: string;
  DeckId: string;
  Type: 'Text' | 'MultipleChoice';
  Question: string;
  Answer: Option;
  Options: Option[];
  
  // SM-2 Spaced Repetition Fields
  Interval: number;       // em dias
  EaseFactor: number;     // Fator de facilidade (default: 2.5)
  Repetitions: number;    // Contagem de repetições bem-sucedidas consecutivas
  NextReview: number;     // Timestamp do próximo estudo
  LastReview?: number;    // Timestamp do último estudo
  
  // Analytics & Stats
  CorrectCount: number;
  WrongCount: number;
  Favorite: boolean;
  CreatedAt: number;
}

export interface Deck {
  Id: string;
  Name: string;
  Index: number;
  CreatedAt: number;
}

export interface StudySession {
  Id: string;
  DeckId: string;
  DeckName: string;
  Date: string;           // YYYY-MM-DD
  Timestamp: number;
  Duration: number;       // em segundos
  CardsReviewed: number;
  CorrectCount: number;
  WrongCount: number;
  XpGained: number;
}

export interface UserStats {
  Id: string;             // 'current'
  Streak: number;
  LastActiveDate?: string;// YYYY-MM-DD
  Xp: number;
  Level: number;
  Achievements: string[]; // ids das conquistas
  WeeklyProgress: Record<string, number>; // data -> XP
}

export interface Snapshot {
  Id: string;
  Timestamp: number;
  Label: string;
  Data: string; // Dados serializados do backup
}

class FlashCardsDatabase extends Dexie {
  decks!: Table<Deck>;
  cards!: Table<Card>;
  studySessions!: Table<StudySession>;
  userStats!: Table<UserStats>;
  snapshots!: Table<Snapshot>;

  constructor() {
    super('FlashCardsDatabase');
    this.version(1).stores({
      decks: 'Id, Name, Index, CreatedAt',
      cards: 'Id, DeckId, Type, NextReview, Favorite, CreatedAt',
      studySessions: 'Id, DeckId, Date, Timestamp',
      userStats: 'Id'
    });
    this.version(2).stores({
      decks: 'Id, Name, Index, CreatedAt',
      cards: 'Id, DeckId, Type, NextReview, Favorite, CreatedAt',
      studySessions: 'Id, DeckId, Date, Timestamp',
      userStats: 'Id',
      snapshots: 'Id, Timestamp, Label'
    });
  }
}

export const db = new FlashCardsDatabase();
