import Constants from 'expo-constants';

import type { DifficultyLevel } from '../types/game';

/**
 * Client HTTP du backend CodeCity.
 *
 * Conçu « offline-first » : chaque appel a un timeout court et renvoie `null`
 * en cas d'échec (serveur absent, hors-ligne, token expiré). L'app reste
 * pleinement jouable sans backend ; la synchronisation est un bonus.
 *
 * URL configurable via `expo.extra.apiUrl` dans app.json (défaut : localhost).
 * Sur un device physique, remplace localhost par l'IP LAN de la machine.
 */
export const BASE_API_URL = (
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  'http://localhost:3050/api'
).replace(/\/+$/, '');

const TIMEOUT_MS = 4000;

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (options.token) headers.Authorization = `Bearer ${options.token}`;

    const res = await fetch(`${BASE_API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
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

export const health = () => request<{ status: string }>('/health');

/**
 * Synchronisation de l'utilisateur AUTHENTIFIÉ (best-effort, silencieuse).
 * Les données sont dérivées du token côté serveur (routes `/api/me`).
 */
export const meApi = {
  patchMe: (
    token: string,
    data: { xp?: number; level?: number; placementLevel?: DifficultyLevel | null }
  ) => request('/me', { method: 'PATCH', body: data, token }),

  postProgress: (
    token: string,
    data: { districtId: string; levelId: string; stars: number }
  ) => request('/me/progress', { method: 'POST', body: data, token }),

  putStreak: (
    token: string,
    data: {
      currentStreak: number;
      longestStreak: number;
      lastPlayedDate: string | null;
    }
  ) => request('/me/streak', { method: 'PUT', body: data, token }),
};
