import { useStreakStore } from '../store/streakStore';
import { useUserStore } from '../store/userStore';
import { api } from './api';

/**
 * Synchronisation « best-effort » entre les stores locaux et le backend.
 * Toutes les fonctions sont non-bloquantes : à appeler avec `void ...`.
 * En cas d'échec réseau, l'app continue normalement (la source de vérité
 * reste locale + persistée via AsyncStorage).
 */

function generateUsername(): string {
  const suffix = Date.now().toString(36).slice(-5);
  return `architect-${suffix}`;
}

/** Crée le compte serveur au premier lancement (une seule fois). */
export async function ensureUser(): Promise<void> {
  const state = useUserStore.getState();
  if (state.userId) return;

  const created = await api.createUser(generateUsername());
  if (created?.id) {
    state.actions.setIdentity(created.id, created.username);
    // Pousse l'état déjà accumulé localement.
    void syncUser();
  }
}

/** Envoie XP / niveau / placement vers le serveur. */
export async function syncUser(): Promise<void> {
  const { userId, xp, level, placementLevel } = useUserStore.getState();
  if (!userId) return;
  await api.patchUser(userId, { xp, level, placementLevel });
}

/** Enregistre la complétion d'un niveau (upsert côté serveur). */
export async function syncProgress(
  districtId: string,
  levelId: string,
  stars: number
): Promise<void> {
  const { userId } = useUserStore.getState();
  if (!userId) return;
  await api.postProgress({ userId, districtId, levelId, stars });
}

/** Envoie l'état de streak courant. */
export async function syncStreak(): Promise<void> {
  const { userId } = useUserStore.getState();
  if (!userId) return;
  const { currentStreak, longestStreak, lastPlayedDate } =
    useStreakStore.getState();
  await api.putStreak(userId, { currentStreak, longestStreak, lastPlayedDate });
}
