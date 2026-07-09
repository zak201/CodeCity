import type { DifficultyLevel } from '../types/game';
import { districts } from './districts';

/**
 * Règles de progression du jeu (fonctions pures, sans état).
 * Le déblocage des quartiers est DÉRIVÉ de la progression et du placement,
 * jamais codé en dur : c'est la source de vérité utilisée par les écrans.
 */

/** Ordre canonique des quartiers sur la carte. */
export const DISTRICT_ORDER = [
  'q1',
  'q2',
  'q3',
  'q4',
  'q5',
  'q6',
  'q7',
  'boss',
] as const;

/** Quartier de départ attribué par le test de placement. */
const PLACEMENT_START: Record<DifficultyLevel, string> = {
  'absolute-beginner': 'q1',
  beginner: 'q2',
  intermediate: 'q3',
  advanced: 'q4',
};

/** XP nécessaire pour gagner un niveau de joueur. */
export const XP_PER_LEVEL = 100;

/** Niveau de joueur dérivé de l'XP cumulée (niveau 1 = 0 XP). */
export function computeLevel(xp: number): number {
  if (xp <= 0) return 1;
  return 1 + Math.floor(xp / XP_PER_LEVEL);
}

/** XP restante avant le prochain niveau de joueur. */
export function xpToNextLevel(xp: number): number {
  const safeXp = Math.max(0, xp);
  return XP_PER_LEVEL - (safeXp % XP_PER_LEVEL);
}

/** Index du quartier de départ (0 si aucun placement encore). */
export function getStartIndex(placementLevel: DifficultyLevel | null): number {
  if (!placementLevel) return 0;
  const id = PLACEMENT_START[placementLevel];
  const idx = DISTRICT_ORDER.indexOf(id as (typeof DISTRICT_ORDER)[number]);
  return idx < 0 ? 0 : idx;
}

function totalLevelsOf(id: string): number {
  return districts.find((d) => d.id === id)?.totalLevels ?? 0;
}

/** Un quartier est complété quand tous ses niveaux sont terminés. */
export function isDistrictCompleted(
  id: string,
  completedCount: number
): boolean {
  const total = totalLevelsOf(id);
  return total > 0 && completedCount >= total;
}

/**
 * Calcule l'état verrouillé/déverrouillé de chaque quartier.
 * - Tous les quartiers jusqu'au quartier de départ (inclus) sont ouverts.
 * - Chaque quartier suivant s'ouvre uniquement quand le précédent est
 *   déverrouillé ET complété (déblocage « en chaîne »).
 */
export function computeLockState(
  placementLevel: DifficultyLevel | null,
  completedCountOf: (id: string) => number
): Record<string, boolean> {
  const startIndex = getStartIndex(placementLevel);
  const locked: Record<string, boolean> = {};

  for (let i = 0; i < DISTRICT_ORDER.length; i++) {
    const id = DISTRICT_ORDER[i];
    if (i <= startIndex) {
      locked[id] = false;
      continue;
    }
    const prevId = DISTRICT_ORDER[i - 1];
    const prevUnlocked = locked[prevId] === false;
    const prevCompleted = isDistrictCompleted(prevId, completedCountOf(prevId));
    locked[id] = !(prevUnlocked && prevCompleted);
  }

  return locked;
}

/** Raccourci : le quartier `id` est-il déverrouillé ? */
export function isDistrictUnlocked(
  id: string,
  placementLevel: DifficultyLevel | null,
  completedCountOf: (id: string) => number
): boolean {
  return computeLockState(placementLevel, completedCountOf)[id] === false;
}

/** Quartier suivant dans l'ordre (ou null si c'est le dernier). */
export function getNextDistrictId(id: string): string | null {
  const idx = DISTRICT_ORDER.indexOf(id as (typeof DISTRICT_ORDER)[number]);
  if (idx < 0 || idx >= DISTRICT_ORDER.length - 1) return null;
  return DISTRICT_ORDER[idx + 1];
}

export interface Badge {
  districtId: string;
  name: string;
  concept: string;
}

/** Un badge est gagné pour chaque quartier entièrement complété. */
export function getEarnedBadges(
  completedCountOf: (id: string) => number
): Badge[] {
  return DISTRICT_ORDER.map((id) =>
    districts.find((d) => d.id === id)
  )
    .filter((d): d is (typeof districts)[number] => d !== undefined)
    .filter((d) => isDistrictCompleted(d.id, completedCountOf(d.id)))
    .map((d) => ({ districtId: d.id, name: d.name, concept: d.concept }));
}

/** Le jeu entier est-il terminé (le boss est complété) ? */
export function isGameComplete(
  completedCountOf: (id: string) => number
): boolean {
  return isDistrictCompleted('boss', completedCountOf('boss'));
}
