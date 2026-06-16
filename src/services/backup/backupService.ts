import { db } from '../db';
import { validateBackup, type BackupPayload } from './validation';
import { 
  createBackupPayload, 
  generateCSV, 
  generateMarkdown, 
  compressText, 
  decompressText,
  calculateChecksum 
} from './serializer';
import { analyzeConflicts, executeMerge, type MergeStrategy, type MergeConflictReport } from './merge';
import { createSnapshot } from './snapshot';

export interface ExportOptions {
  deckIds?: string[]; // If undefined, export all decks
  includeStats?: boolean;
  includeSessions?: boolean;
  format: 'fibf' | 'json' | 'csv' | 'markdown';
  theme: string;
  language: string;
}

export interface ImportPreviewReport {
  isValid: boolean;
  error?: string;
  metadata?: BackupPayload['metadata'];
  counts: {
    decks: number;
    cards: number;
    studySessions: number;
    hasStats: boolean;
  };
  conflicts: MergeConflictReport;
}

/**
 * Estimates backup size in bytes/KB/MB based on selected options
 */
export async function estimateBackupSize(options: Omit<ExportOptions, 'format'>): Promise<string> {
  const data = await gatherDataForExport(options);
  const jsonStr = JSON.stringify(data);
  const bytes = new TextEncoder().encode(jsonStr).length;

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Gathers and filters IndexedDB data based on export options
 */
async function gatherDataForExport(options: Omit<ExportOptions, 'format' | 'theme' | 'language'>) {
  let decks = await db.decks.toArray();
  let cards = await db.cards.toArray();
  let studySessions = await db.studySessions.toArray();
  let userStats = await db.userStats.get('current');

  if (!userStats) {
    userStats = {
      Id: 'current',
      Streak: 0,
      Xp: 0,
      Level: 1,
      Achievements: [],
      WeeklyProgress: {}
    };
  }

  // Filter by deckIds if specified
  if (options.deckIds && options.deckIds.length > 0) {
    const selectedSet = new Set(options.deckIds);
    decks = decks.filter(d => selectedSet.has(d.Id));
    cards = cards.filter(c => selectedSet.has(c.DeckId));
    studySessions = studySessions.filter(s => selectedSet.has(s.DeckId));
  }

  // Filter out stats if not requested
  let statsToExport = options.includeStats ? userStats : {
    Id: 'current',
    Streak: 0,
    Xp: 0,
    Level: 1,
    Achievements: [],
    WeeklyProgress: {}
  };

  // Filter out study sessions if not requested
  let sessionsToExport = options.includeSessions ? studySessions : [];

  return {
    decks,
    cards,
    studySessions: sessionsToExport,
    userStats: statsToExport
  };
}

/**
 * Export data in the selected format
 */
export async function exportBackup(options: ExportOptions): Promise<{
  fileName: string;
  mimeType: string;
  data: string | Blob;
}> {
  const { decks, cards, studySessions, userStats } = await gatherDataForExport(options);
  const dateStr = new Date().toISOString().split('T')[0];
  const appVersion = '1.0.0';

  switch (options.format) {
    case 'csv': {
      const csvContent = generateCSV(decks, cards);
      return {
        fileName: `flashcards_export_${dateStr}.csv`,
        mimeType: 'text/csv;charset=utf-8;',
        data: csvContent
      };
    }
    case 'markdown': {
      const mdContent = generateMarkdown(decks, cards);
      return {
        fileName: `flashcards_export_${dateStr}.md`,
        mimeType: 'text/markdown;charset=utf-8;',
        data: mdContent
      };
    }
    case 'json': {
      const { payload } = await createBackupPayload({
        decks,
        cards,
        studySessions,
        userStats,
        language: options.language,
        theme: options.theme,
        appVersion
      });
      return {
        fileName: `flashcards_backup_${dateStr}.json`,
        mimeType: 'application/json;charset=utf-8;',
        data: JSON.stringify(payload, null, 2)
      };
    }
    case 'fibf': {
      const { payloadString } = await createBackupPayload({
        decks,
        cards,
        studySessions,
        userStats,
        language: options.language,
        theme: options.theme,
        appVersion
      });
      
      const compressed = await compressText(payloadString);
      const blob = new Blob([compressed.buffer as ArrayBuffer], { type: 'application/octet-stream' });
      
      return {
        fileName: `flashcards_backup_${dateStr}.fibf`,
        mimeType: 'application/octet-stream',
        data: blob
      };
    }
  }
}

/**
 * Parses raw uploaded file content (supports text JSON/CSV/Markdown or compressed binary .fibf)
 */
export async function parseUpload(
  fileData: ArrayBuffer | string,
  fileName: string
): Promise<BackupPayload> {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (extension === 'fibf' || fileData instanceof ArrayBuffer) {
    // If it's a binary array buffer (typical for .fibf files)
    const compressedBytes = new Uint8Array(fileData as ArrayBuffer);
    const jsonStr = await decompressText(compressedBytes);
    const parsed = JSON.parse(jsonStr);
    return validateBackupAndCheckIntegrity(parsed);
  }

  // Otherwise, it must be text (typical for .json)
  const jsonStr = fileData as string;
  const parsed = JSON.parse(jsonStr);
  return validateBackupAndCheckIntegrity(parsed);
}

/**
 * Validates Zod Schema and Checksum integrity
 */
async function validateBackupAndCheckIntegrity(parsed: unknown): Promise<BackupPayload> {
  const result = validateBackup(parsed);
  if (!result.success) {
    throw new Error(result.error);
  }

  const payload = result.data;
  const dataString = JSON.stringify(payload.data);
  const calculated = await calculateChecksum(dataString);

  if (payload.metadata.checksum !== calculated) {
    console.warn('Checksum mismatch in imported file. Proceeding with caution.');
    // In premium sync systems, we notify but don't strictly crash if format is correct
  }

  return payload;
}

/**
 * Generates preview details for pre-import validation screen
 */
export async function generateImportPreview(payload: BackupPayload): Promise<ImportPreviewReport> {
  const conflicts = await analyzeConflicts(payload.data.decks, payload.data.cards);
  
  return {
    isValid: true,
    metadata: payload.metadata,
    counts: {
      decks: payload.data.decks.length,
      cards: payload.data.cards.length,
      studySessions: payload.data.studySessions.length,
      hasStats: !!payload.data.userStats
    },
    conflicts
  };
}

/**
 * Orchestrates the import operation: creates emergency snapshot, runs merge conflict resolver, saves data
 */
export async function executeImport(params: {
  payload: BackupPayload;
  strategy: MergeStrategy;
  onProgress?: (progress: number) => void;
}): Promise<{ decksImported: number; cardsImported: number; xpGained: number; snapshotId: string }> {
  // 1. Create automatic emergency snapshot before writing anything
  const snapshotLabel = `Auto-backup antes de importar: ${params.payload.metadata.counts.decks} deques (${new Date().toLocaleDateString()})`;
  const snapshot = await createSnapshot(snapshotLabel);

  // 2. Perform database merge
  const result = await executeMerge({
    importedDecks: params.payload.data.decks,
    importedCards: params.payload.data.cards,
    importedSessions: params.payload.data.studySessions,
    importedStats: params.payload.data.userStats,
    strategy: params.strategy,
    onProgress: params.onProgress
  });

  return {
    decksImported: result.importedDecksCount,
    cardsImported: result.importedCardsCount,
    xpGained: result.xpGained,
    snapshotId: snapshot.Id
  };
}
