import { z } from 'zod';

export const OptionSchema = z.object({
  Id: z.union([z.string(), z.number()]),
  Option: z.string(),
  IsAnswer: z.boolean()
});

export const CardSchema = z.object({
  Id: z.string(),
  DeckId: z.string(),
  Type: z.enum(['Text', 'MultipleChoice']),
  Question: z.string(),
  Answer: OptionSchema,
  Options: z.array(OptionSchema),
  Interval: z.number(),
  EaseFactor: z.number(),
  Repetitions: z.number(),
  NextReview: z.number(),
  LastReview: z.number().optional(),
  CorrectCount: z.number(),
  WrongCount: z.number(),
  Favorite: z.boolean(),
  CreatedAt: z.number()
});

export const DeckSchema = z.object({
  Id: z.string(),
  Name: z.string(),
  Index: z.number(),
  CreatedAt: z.number()
});

export const StudySessionSchema = z.object({
  Id: z.string(),
  DeckId: z.string(),
  DeckName: z.string(),
  Date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  Timestamp: z.number(),
  Duration: z.number(),
  CardsReviewed: z.number(),
  CorrectCount: z.number(),
  WrongCount: z.number(),
  XpGained: z.number()
});

export const UserStatsSchema = z.object({
  Id: z.string(),
  Streak: z.number(),
  LastActiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  Xp: z.number(),
  Level: z.number(),
  Achievements: z.array(z.string()),
  WeeklyProgress: z.record(z.string(), z.number())
});

export const BackupMetadataSchema = z.object({
  format: z.string(),
  version: z.string(),
  createdAt: z.number(),
  appVersion: z.string(),
  checksum: z.string(),
  language: z.string(),
  theme: z.string(),
  counts: z.object({
    decks: z.number(),
    cards: z.number(),
    studySessions: z.number()
  })
});

export const BackupPayloadSchema = z.object({
  metadata: BackupMetadataSchema,
  data: z.object({
    decks: z.array(DeckSchema).default([]),
    cards: z.array(CardSchema).default([]),
    studySessions: z.array(StudySessionSchema).default([]),
    userStats: UserStatsSchema.optional()
  })
});

export type BackupPayload = z.infer<typeof BackupPayloadSchema>;

export function validateBackup(payload: unknown): { success: true; data: BackupPayload } | { success: false; error: string } {
  try {
    const parsed = BackupPayloadSchema.parse(payload);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      return { success: false, error: formattedErrors };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}
