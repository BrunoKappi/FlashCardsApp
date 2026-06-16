import { type Card } from '../../../services/db';

/**
 * Filtra cards que estão prontos para revisão (NextReview <= agora)
 */
export function getDueCards(cards: Card[]): Card[] {
  const now = Date.now();
  return cards.filter(card => card.NextReview <= now);
}

/**
 * Agrupa os cards por Deck ID
 */
export function groupCardsByDeck(cards: Card[]): Record<string, Card[]> {
  return cards.reduce((acc, card) => {
    if (!acc[card.DeckId]) {
      acc[card.DeckId] = [];
    }
    acc[card.DeckId].push(card);
    return acc;
  }, {} as Record<string, Card[]>);
}

/**
 * Retorna as estatísticas de cards pendentes por deck
 */
export function getDeckStudyStats(deckId: string, cards: Card[]) {
  const deckCards = cards.filter(c => c.DeckId === deckId);
  const now = Date.now();
  
  const due = deckCards.filter(c => c.NextReview <= now);
  const newCards = deckCards.filter(c => c.Repetitions === 0);
  const learning = deckCards.filter(c => c.Repetitions > 0 && c.NextReview > now);

  return {
    total: deckCards.length,
    due: due.length,
    newCards: newCards.length,
    learning: learning.length
  };
}

/**
 * Gera coleções inteligentes de cards (Smart Decks)
 */
export function generateSmartCollections(cards: Card[]) {
  const now = Date.now();

  // Mais Difíceis: Ordenadas pelo menor Fator de Facilidade (EaseFactor)
  const mostDifficult = [...cards]
    .filter(c => c.EaseFactor < 2.0 || c.WrongCount > 2)
    .sort((a, b) => a.EaseFactor - b.EaseFactor)
    .slice(0, 30);

  // Mais Erradas: Ordenadas pelo maior número de erros
  const mostIncorrect = [...cards]
    .filter(c => c.WrongCount > 0)
    .sort((a, b) => b.WrongCount - a.WrongCount)
    .slice(0, 30);

  // Não Revisadas: Repetitions = 0
  const unreviewed = cards.filter(c => c.Repetitions === 0);

  // Favoritas: Favorite = true
  const favorites = cards.filter(c => c.Favorite);

  // Próximas Revisões: Cards que vencerão em breve, ordenados pelo NextReview
  const upcomingReviews = [...cards]
    .filter(c => c.NextReview > now)
    .sort((a, b) => a.NextReview - b.NextReview)
    .slice(0, 30);

  return {
    mostDifficult,
    mostIncorrect,
    unreviewed,
    favorites,
    upcomingReviews
  };
}
