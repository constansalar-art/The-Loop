import { AREA_ORDER, type AreaCode } from "@/data/areas";
import type { Points } from "@/data/quiz";

/**
 * Motor de puntaje del test — ARCHIVO PARA TUNEAR.
 *
 * Todo lo ajustable vive acá:
 *   1. AREA_WEIGHTS  → multiplicador por área (para compensar áreas que
 *      aparecen más o menos veces en las opciones).
 *   2. TIEBREAK_ORDER → orden de prioridad para desempatar.
 *
 * El resto del sitio solo llama a `computeResult(answers)`.
 */

/** Pesos globales por área. 1 = neutro. Subilos/bajalos tras testear. */
export const AREA_WEIGHTS: Record<AreaCode, number> = {
  TEC: 1,
  NEG: 1,
  SAL: 1,
  SOC: 1,
  DER: 1,
  ART: 1,
};

/**
 * Orden de desempate. En empate gana el área que aparece PRIMERO en esta lista.
 * Consigna: SAL > DER > TEC > NEG > SOC > ART (para que el empate no caiga
 * siempre en la misma área).
 */
export const TIEBREAK_ORDER: AreaCode[] = ["SAL", "DER", "TEC", "NEG", "SOC", "ART"];

export type Scores = Record<AreaCode, number>;

function emptyScores(): Scores {
  return { TEC: 0, NEG: 0, SAL: 0, SOC: 0, DER: 0, ART: 0 };
}

/**
 * Suma los puntos de una lista de opciones elegidas (los `points` de cada
 * opción del quiz), aplicando los pesos globales por área.
 */
export function tally(answers: Points[]): Scores {
  const scores = emptyScores();
  for (const points of answers) {
    for (const [area, value] of Object.entries(points) as [AreaCode, number][]) {
      scores[area] += value;
    }
  }
  for (const area of AREA_ORDER) {
    scores[area] = scores[area] * AREA_WEIGHTS[area];
  }
  return scores;
}

/**
 * Devuelve el área ganadora aplicando el desempate configurado.
 * Ante puntajes iguales, gana la que esté antes en TIEBREAK_ORDER.
 */
export function winningArea(scores: Scores): AreaCode {
  let winner: AreaCode = TIEBREAK_ORDER[0];
  let best = -Infinity;
  // Recorremos en orden de desempate: como usamos ">" estricto, el primero
  // en la lista con el puntaje máximo se queda como ganador.
  for (const area of TIEBREAK_ORDER) {
    if (scores[area] > best) {
      best = scores[area];
      winner = area;
    }
  }
  return winner;
}

export interface Result {
  area: AreaCode;
  scores: Scores;
  /** Ranking de áreas de mayor a menor (para mostrar el "también te pega"). */
  ranking: AreaCode[];
}

/** Cálculo completo a partir de las opciones elegidas. */
export function computeResult(answers: Points[]): Result {
  const scores = tally(answers);
  const area = winningArea(scores);
  const ranking = [...AREA_ORDER].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    // Desempate por prioridad para un orden estable.
    return TIEBREAK_ORDER.indexOf(a) - TIEBREAK_ORDER.indexOf(b);
  });
  return { area, scores, ranking };
}
