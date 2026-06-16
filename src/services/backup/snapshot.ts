import { db, type Snapshot } from '../db';
import { createBackupPayload, decompressText, compressText } from './serializer';
import { validateBackup } from './validation';
import { v4 as uuidv4 } from 'uuid';

const MAX_SNAPSHOTS = 10; // Keep up to 10 snapshots

export async function createSnapshot(label: string): Promise<Snapshot> {
  const decks = await db.decks.toArray();
  const cards = await db.cards.toArray();
  const studySessions = await db.studySessions.toArray();
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

  // Generate payload
  const { payloadString } = await createBackupPayload({
    decks,
    cards,
    studySessions,
    userStats,
    language: localStorage.getItem('language') || 'pt',
    theme: localStorage.getItem('theme') || 'dark',
    appVersion: '1.0.0'
  });

  // Compress to save IndexedDB space
  const compressedData = await compressText(payloadString);
  
  // Convert binary to base64 string to store as text in Dexie table
  // (In modern browsers we can convert Uint8Array to string via base64 or btoa)
  // Let's use a safe base64 converter:
  let binary = '';
  const len = compressedData.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(compressedData[i]);
  }
  const base64Data = btoa(binary);

  const snapshot: Snapshot = {
    Id: uuidv4(),
    Timestamp: Date.now(),
    Label: label,
    Data: base64Data
  };

  await db.snapshots.add(snapshot);

  // Enforce limit: delete oldest snapshots if count exceeds MAX_SNAPSHOTS
  const allSnapshots = await db.snapshots.toArray();
  allSnapshots.sort((a, b) => a.Timestamp - b.Timestamp);
  if (allSnapshots.length > MAX_SNAPSHOTS) {
    const toDelete = allSnapshots.slice(0, allSnapshots.length - MAX_SNAPSHOTS);
    await Promise.all(toDelete.map((s: Snapshot) => db.snapshots.delete(s.Id)));
  }

  return snapshot;
}

export async function restoreSnapshot(snapshotId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const snapshot = await db.snapshots.get(snapshotId);
    if (!snapshot) {
      return { success: false, error: 'Snapshot not found' };
    }

    // Decode base64 back to Uint8Array
    const binaryString = atob(snapshot.Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decompress
    const decompressedJson = await decompressText(bytes);
    const backupObj = JSON.parse(decompressedJson);

    // Validate
    const validation = validateBackup(backupObj);
    if (!validation.success) {
      return { success: false, error: `Invalid snapshot data: ${validation.error}` };
    }

    const { decks, cards, studySessions, userStats } = validation.data.data;

    // Clear current database (except snapshots themselves!)
    await db.decks.clear();
    await db.cards.clear();
    await db.studySessions.clear();
    await db.userStats.clear();

    // Import from snapshot
    if (decks.length > 0) await db.decks.bulkAdd(decks);
    if (cards.length > 0) await db.cards.bulkAdd(cards);
    if (studySessions.length > 0) await db.studySessions.bulkAdd(studySessions);
    if (userStats) await db.userStats.put(userStats);

    return { success: true };
  } catch (error: any) {
    console.error('Error during snapshot restoration:', error);
    return { success: false, error: error.message || 'Unknown restoration error' };
  }
}

export async function getSnapshotsList(): Promise<Omit<Snapshot, 'Data'>[]> {
  const all = await db.snapshots.toArray();
  all.sort((a, b) => a.Timestamp - b.Timestamp);
  // Return list in reverse chronological order (newest first)
  return all.reverse().map(({ Id, Timestamp, Label }: Snapshot) => ({ Id, Timestamp, Label }));
}

export async function deleteSnapshot(id: string): Promise<void> {
  await db.snapshots.delete(id);
}
