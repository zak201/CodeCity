import Constants from 'expo-constants';

import type { DifficultyLevel } from '../types/game';

/**
 * Client HTTP du backend CodeCity.
 *
 * Conçu « offline-first » : chaque appel a un timeout court et renvoie `null`
 * en cas d'échec (serveur absent, hors-ligne, device qui ne joint pas le LAN).
 * L'app reste pleinement jouable sans backend ; la synchronisation est un bonus.
 *
 * URL configurable via `expo.extra.apiUrl` dans app.json (défaut : localhost).
 * Sur un device physique, remplace localhost par l'IP LAN de la machine.
 */
const BASE_URL = (
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  'http://localhost:3050/api'
).replace(/\/+$/, '');

const TIMEOUT_MS = 4000;

export interface ApiUser {
  id: string;
  username: string;
  xp: number;
  level: number;
  placementLevel?: string | null;
}

export interface ApiProgress {
  id: string;
  userId: string;
  districtId: string;
  levelId: string;
  stars: number;
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Réseau indisponible : on n'interrompt jamais le jeu.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  health: () => request<{ status: string }>('/health'),

  createUser: (username: string) =>
    request<ApiUser>('/users', {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),

  getUser: (id: string) => request<ApiUser>(`/users/${id}`),

  patchUser: (
    id: string,
    data: { xp?: number; level?: number; placementLevel?: DifficultyLevel | null }
  ) =>
    request<ApiUser>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getProgress: (userId: string) =>
    request<ApiProgress[]>(`/progress/${userId}`),

  postProgress: (data: {
    userId: string;
    districtId: string;
    levelId: string;
    stars: number;
  }) =>
    request<ApiProgress>('/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  putStreak: (
    userId: string,
    data: {
      currentStreak: number;
      longestStreak: number;
      lastPlayedDate: string | null;
    }
  ) =>
    request<unknown>(`/users/${userId}/streak`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
