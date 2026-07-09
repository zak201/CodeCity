import { getLevelsForDistrict } from '../data/levels/registry';
import { DISTRICT_ORDER, getStartIndex } from '../data/progression';
import { useProgressStore } from '../store/progressStore';
import { useUserStore } from '../store/userStore';
import type { DifficultyLevel } from '../types/game';

/**
 * Crédite les quartiers « sautés » par le test de placement.
 *
 * Si le joueur est placé plus haut que le début (ex. Avancé → Fonctions),
 * les quartiers précédents (Variables, Conditions, Boucles…) sont considérés
 * comme maîtrisés : on les marque terminés (3 étoiles) et on accorde leur XP,
 * ce qui débloque aussi leurs badges.
 *
 * Idempotent : un niveau déjà complété n'est jamais recrédité (pas de double XP),
 * donc la fonction peut être appelée à chaque montage sans risque.
 */
export function creditSkippedDistricts(
  placementLevel: DifficultyLevel | null
): void {
  if (!placementLevel) return;

  const startIndex = getStartIndex(placementLevel);
  if (startIndex <= 0) return; // Débutant absolu : rien à créditer.

  const completeLevel = useProgressStore.getState().actions.completeLevel;
  const addXP = useUserStore.getState().actions.addXP;

  for (let i = 0; i < startIndex; i++) {
    const districtId = DISTRICT_ORDER[i];
    const levels = getLevelsForDistrict(districtId);
    if (levels.length === 0) continue;

    for (const level of levels) {
      const already =
        useProgressStore.getState().byDistrict[districtId]?.completedLevels ??
        [];
      if (already.includes(level.id)) continue; // déjà crédité

      completeLevel(districtId, level.id, 3);
      addXP(level.xpReward);
    }
  }
}
