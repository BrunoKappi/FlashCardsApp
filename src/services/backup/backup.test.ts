import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateBackup } from './validation';
import { calculateChecksum, generateCSV, generateMarkdown } from './serializer';
import { executeMerge } from './merge';
import { db } from '../db';

// Mock the dexie database
vi.mock('../db', () => {
  const mockTable = () => ({
    get: vi.fn(),
    add: vi.fn(),
    put: vi.fn(),
    toArray: vi.fn(),
    clear: vi.fn(),
  });
  return {
    db: {
      decks: mockTable(),
      cards: mockTable(),
      studySessions: mockTable(),
      userStats: mockTable(),
      snapshots: mockTable(),
    }
  };
});

describe('Backup Validation Schemas', () => {
  it('should validate a correct complete backup structure', () => {
    const validBackup = {
      metadata: {
        format: 'fibf',
        version: '1.0.0',
        createdAt: Date.now(),
        appVersion: '1.0.0',
        checksum: 'some-sha256-hash',
        language: 'pt',
        theme: 'dark',
        counts: { decks: 1, cards: 1, studySessions: 0 }
      },
      data: {
        decks: [{ Id: 'deck-1', Name: 'Vite & React', Index: 1, CreatedAt: Date.now() }],
        cards: [{
          Id: 'card-1',
          DeckId: 'deck-1',
          Type: 'Text',
          Question: 'O que é JSX?',
          Answer: { Id: 'ans-1', Option: 'Extensão de sintaxe do JS', IsAnswer: true },
          Options: [{ Id: 'ans-1', Option: 'Extensão de sintaxe do JS', IsAnswer: true }],
          Interval: 0,
          EaseFactor: 2.5,
          Repetitions: 0,
          NextReview: Date.now(),
          CorrectCount: 0,
          WrongCount: 0,
          Favorite: false,
          CreatedAt: Date.now()
        }],
        studySessions: [],
        userStats: {
          Id: 'current',
          Streak: 0,
          Xp: 100,
          Level: 2,
          Achievements: [],
          WeeklyProgress: {}
        }
      }
    };

    const result = validateBackup(validBackup);
    expect(result.success).toBe(true);
  });

  it('should fail validation when metadata or data is missing/malformed', () => {
    const invalidBackup = {
      metadata: {
        format: 'fibf'
      },
      data: {}
    };

    const result = validateBackup(invalidBackup);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('metadata');
    }
  });
});

describe('Checksum Integrity Utility', () => {
  it('should consistently generate same hash for same text', async () => {
    const text = 'test-content';
    const hash1 = await calculateChecksum(text);
    const hash2 = await calculateChecksum(text);
    expect(hash1).toBe(hash2);
    expect(typeof hash1).toBe('string');
  });

  it('should generate different hashes for different texts', async () => {
    const hashA = await calculateChecksum('content-A');
    const hashB = await calculateChecksum('content-B');
    expect(hashA).not.toBe(hashB);
  });
});

describe('CSV & Markdown Generation', () => {
  const mockDecks = [
    { Id: 'd1', Name: 'React', Index: 1, CreatedAt: 1000 }
  ];
  const mockCards = [
    {
      Id: 'c1',
      DeckId: 'd1',
      Type: 'Text' as const,
      Question: 'State in React?',
      Answer: { Id: 'o1', Option: 'Local state', IsAnswer: true },
      Options: [{ Id: 'o1', Option: 'Local state', IsAnswer: true }],
      Interval: 0,
      EaseFactor: 2.5,
      Repetitions: 0,
      NextReview: 2000,
      CorrectCount: 0,
      WrongCount: 0,
      Favorite: false,
      CreatedAt: 1000
    }
  ];

  it('should generate correct CSV string matching columns', () => {
    const csv = generateCSV(mockDecks, mockCards);
    expect(csv).toContain('Deck Name,Card ID,Type,Question,Answer,Options,Favorite,Created At');
    expect(csv).toContain('React');
    expect(csv).toContain('State in React?');
  });

  it('should generate readable markdown representation', () => {
    const md = generateMarkdown(mockDecks, mockCards);
    expect(md).toContain('# Flashcards.io Study Export');
    expect(md).toContain('## Category: React');
    expect(md).toContain('### Q: State in React?');
  });
});

describe('Merge Conflict Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute merge with overwrite strategy successfully', async () => {
    const importedDecks = [{ Id: 'd-new', Name: 'Imported Deck', Index: 1, CreatedAt: Date.now() }];
    const importedCards = [{
      Id: 'c-new',
      DeckId: 'd-new',
      Type: 'Text' as const,
      Question: 'Imported Question?',
      Answer: { Id: 'o-new', Option: 'Yes', IsAnswer: true },
      Options: [{ Id: 'o-new', Option: 'Yes', IsAnswer: true }],
      Interval: 0,
      EaseFactor: 2.5,
      Repetitions: 0,
      NextReview: Date.now(),
      CorrectCount: 0,
      WrongCount: 0,
      Favorite: false,
      CreatedAt: Date.now()
    }];

    // Setup mocks
    vi.mocked(db.decks.get).mockResolvedValue(undefined); // No conflicts
    vi.mocked(db.cards.get).mockResolvedValue(undefined);

    const result = await executeMerge({
      importedDecks,
      importedCards,
      importedSessions: [],
      strategy: 'overwrite'
    });

    expect(result.importedDecksCount).toBe(1);
    expect(result.importedCardsCount).toBe(1);
    expect(db.decks.add).toHaveBeenCalledTimes(1);
    expect(db.cards.add).toHaveBeenCalledTimes(1);
  });

  it('should merge statistics when card conflicts exist with strategy "merge"', async () => {
    const conflictingDeck = { Id: 'd-1', Name: 'Local Deck', Index: 1, CreatedAt: 100 };
    const importedCards = [{
      Id: 'c-1',
      DeckId: 'd-1',
      Type: 'Text' as const,
      Question: 'Conflict Q?',
      Answer: { Id: 'o-1', Option: 'Ans', IsAnswer: true },
      Options: [{ Id: 'o-1', Option: 'Ans', IsAnswer: true }],
      Interval: 2,
      EaseFactor: 2.7,
      Repetitions: 3,
      NextReview: 5000,
      CorrectCount: 5,
      WrongCount: 1,
      Favorite: true,
      CreatedAt: 100
    }];

    const localCard = {
      Id: 'c-1',
      DeckId: 'd-1',
      Type: 'Text' as const,
      Question: 'Conflict Q?',
      Answer: { Id: 'o-1', Option: 'Ans', IsAnswer: true },
      Options: [{ Id: 'o-1', Option: 'Ans', IsAnswer: true }],
      Interval: 1,
      EaseFactor: 2.5,
      Repetitions: 1,
      NextReview: 3000,
      CorrectCount: 2,
      WrongCount: 0,
      Favorite: false,
      CreatedAt: 100
    };

    vi.mocked(db.decks.get).mockResolvedValue(conflictingDeck);
    vi.mocked(db.cards.get).mockResolvedValue(localCard as any);

    const result = await executeMerge({
      importedDecks: [conflictingDeck],
      importedCards,
      importedSessions: [],
      strategy: 'merge'
    });

    expect(result.importedDecksCount).toBe(1);
    expect(result.importedCardsCount).toBe(1);
    
    // Validate card merging calculations
    expect(db.cards.put).toHaveBeenCalledWith(expect.objectContaining({
      Id: 'c-1',
      CorrectCount: 7, // 5 + 2
      WrongCount: 1,   // 1 + 0
      Repetitions: 3,  // Max(1, 3)
      EaseFactor: 2.7  // Taken from the more advanced card (higher repetitions)
    }));
  });
});
