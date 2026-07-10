import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { useStreakStore } from '../store/streakStore';
import { useUserStore } from '../store/userStore';
import { meApi } from './api';

/**
 * Synchronisation « best-effort » entre les stores locaux et le backend.
 * Toutes les fonctions sont non-bloquantes (`void ...`) et ne font RIEN si le
 * joueur n'est pas connecté : la source de vérité reste locale (offline-first),
 * la synchro n'est active que sur un compte authentifié (JWT).
 */

/** Envoie XP / niveau / placement vers le compte connecté. */
export async function syncUser(): Promise<void> {
  const token = useAuthStore.getState().token;
  if (!token) return;
  const { xp, level, placementLevel } = useUserStore.getState();
  await meApi.patchMe(token, { xp, level, placementLevel });
}

/** Enregistre la complétion d'un niveau (upsert côté serveur). */
export async function syncProgress(
  districtId: string,
  levelId: string,
  stars: number
): Promise<void> {
  const token = useAuthStore.getState().token;
  if (!token) return;
  await meApi.postProgress(token, { districtId, levelId, stars });
}

/** Envoie l'état de série (streak) courant. */
export async function syncStreak(): Promise<void> {
  const token = useAuthStore.getState().token;
  if (!token) return;
  const { currentStreak, longestStreak, lastPlayedDate } =
    useStreakStore.getState();
  await meApi.putStreak(token, { currentStreak, longestStreak, lastPlayedDate });
}

/**
 * Pousse toute la progression locale vers le compte, juste après connexion,
 * pour « réclamer » la partie jouée hors-ligne. Best-effort.
 */
export async function pushLocalToServer(): Promise<void> {
  const token = useAuthStore.getState().token;
  if (!token) return;
  await syncUser();
  await syncStreak();
  const byDistrict = useProgressStore.getState().byDistrict;
  for (const [districtId, dp] of Object.entries(byDistrict)) {
    for (const levelId of dp.completedLevels) {
      const stars = dp.stars[levelId] ?? 1;
      await meApi.postProgress(token, { districtId, levelId, stars });
    }
  }
}
