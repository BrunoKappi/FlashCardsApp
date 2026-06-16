/**
 * Implementação do algoritmo SuperMemo-2 (SM-2) para repetição espaçada.
 * 
 * @param quality Nota de facilidade de memorização (0 a 5):
 *   5: Resposta perfeita (Fácil)
 *   4: Resposta correta com hesitação (Bom)
 *   3: Resposta correta com dificuldade (Difícil)
 *   2: Resposta incorreta, mas parecia fácil (Errou por pouco)
 *   1: Resposta incorreta, mas lembrou ao ver (Errou)
 *   0: Esquecimento total
 * @param prevRepetitions Número de repetições bem-sucedidas consecutivas
 * @param prevInterval Intervalo atual em dias
 * @param prevEaseFactor Fator de facilidade atual (default: 2.5)
 */
export function calculateSM2(
  quality: number,
  prevRepetitions: number,
  prevInterval: number,
  prevEaseFactor: number
) {
  let repetitions = prevRepetitions;
  let interval = prevInterval;
  let easeFactor = prevEaseFactor;

  // Garantir limites mínimos do Fator de Facilidade
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  if (quality >= 3) {
    // Resposta Correta
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Resposta Incorreta
    repetitions = 0;
    interval = 1;
  }

  // Ajustar o Fator de Facilidade (EF) com base no feedback
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return {
    repetitions,
    interval,
    easeFactor,
    nextReview: Date.now() + interval * 24 * 60 * 60 * 1000 // converte dias para ms
  };
}
