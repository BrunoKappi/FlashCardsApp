import { type Card, type Deck, type StudySession, type UserStats } from '../db';

export async function calculateChecksum(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn("SubtleCrypto failed, falling back to simple hash", e);
    }
  }
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

// Compressor using standard browser CompressionStream API
export async function compressText(text: string): Promise<Uint8Array> {
  if (typeof CompressionStream === 'undefined') {
    return new TextEncoder().encode(text);
  }
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    }
  }).pipeThrough(new CompressionStream('gzip'));
  
  const response = new Response(stream);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

// Decompressor using DecompressionStream API
export async function decompressText(compressed: Uint8Array): Promise<string> {
  if (typeof DecompressionStream === 'undefined') {
    return new TextDecoder().decode(compressed);
  }
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(compressed);
      controller.close();
    }
  }).pipeThrough(new DecompressionStream('gzip'));
  
  const response = new Response(stream);
  const buffer = await response.arrayBuffer();
  return new TextDecoder().decode(buffer);
}

// CSV escaper helper
function escapeCSV(val: string | number | boolean | undefined | null): string {
  if (val === undefined || val === null) return '';
  let str = String(val);
  str = str.replace(/"/g, '""');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str}"`;
  }
  return str;
}

export function generateCSV(decks: Deck[], cards: Card[]): string {
  const headers = ['Deck Name', 'Card ID', 'Type', 'Question', 'Answer', 'Options', 'Favorite', 'Created At'];
  const rows = [headers.join(',')];

  const deckMap = new Map(decks.map(d => [d.Id, d.Name]));

  for (const card of cards) {
    const deckName = deckMap.get(card.DeckId) || 'Unknown';
    const optionsStr = card.Options.map(o => o.Option + (o.IsAnswer ? ' [Correct]' : '')).join(' | ');
    const row = [
      escapeCSV(deckName),
      escapeCSV(card.Id),
      escapeCSV(card.Type),
      escapeCSV(card.Question),
      escapeCSV(card.Answer.Option),
      escapeCSV(optionsStr),
      escapeCSV(card.Favorite),
      escapeCSV(new Date(card.CreatedAt).toISOString())
    ];
    rows.push(row.join(','));
  }

  return rows.join('\n');
}

export function generateMarkdown(decks: Deck[], cards: Card[]): string {
  let md = `# Flashcards.io Study Export\n\n`;
  md += `Exported on: ${new Date().toLocaleString()}\n\n`;

  for (const deck of decks) {
    md += `## Category: ${deck.Name}\n\n`;
    const deckCards = cards.filter(c => c.DeckId === deck.Id);
    if (deckCards.length === 0) {
      md += `*No cards in this deck.*\n\n`;
      continue;
    }

    for (const card of deckCards) {
      md += `### Q: ${card.Question}\n`;
      md += `**Type**: ${card.Type === 'MultipleChoice' ? 'Multiple Choice' : 'Text Answer'}\n`;
      
      if (card.Type === 'MultipleChoice') {
        md += `**Options**:\n`;
        for (const opt of card.Options) {
          md += `- [${opt.IsAnswer ? 'x' : ' '}] ${opt.Option}\n`;
        }
      }
      
      md += `\n**Answer**:\n> ${card.Answer.Option}\n\n`;
      md += `---\n\n`;
    }
  }

  return md;
}

export interface SerializedBackup {
  metadata: {
    format: string;
    version: string;
    createdAt: number;
    appVersion: string;
    checksum: string;
    language: string;
    theme: string;
    counts: {
      decks: number;
      cards: number;
      studySessions: number;
    };
  };
  data: {
    decks: Deck[];
    cards: Card[];
    studySessions: StudySession[];
    userStats: UserStats;
  };
}

export async function createBackupPayload(params: {
  decks: Deck[];
  cards: Card[];
  studySessions: StudySession[];
  userStats: UserStats;
  language: string;
  theme: string;
  appVersion: string;
}): Promise<{ payload: SerializedBackup; payloadString: string; checksum: string }> {
  // 1. Prepare data payload
  const backupData = {
    decks: params.decks,
    cards: params.cards,
    studySessions: params.studySessions,
    userStats: params.userStats
  };

  // 2. Generate a temporary JSON string to compute hash
  const dataString = JSON.stringify(backupData);
  const checksum = await calculateChecksum(dataString);

  // 3. Construct full payload
  const payload: SerializedBackup = {
    metadata: {
      format: 'fibf',
      version: '1.0.0',
      createdAt: Date.now(),
      appVersion: params.appVersion,
      checksum: checksum,
      language: params.language,
      theme: params.theme,
      counts: {
        decks: params.decks.length,
        cards: params.cards.length,
        studySessions: params.studySessions.length
      }
    },
    data: backupData
  };

  const payloadString = JSON.stringify(payload);
  return { payload, payloadString, checksum };
}
