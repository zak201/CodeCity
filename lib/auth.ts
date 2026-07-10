import { BASE_API_URL } from './api';
import type { AuthUser } from '../store/authStore';

/**
 * Appels d'authentification (inscription / connexion).
 *
 * Contrairement à la synchro (silencieuse), ces appels renvoient un message
 * d'erreur exploitable par l'UI (formulaire de connexion).
 */

const TIMEOUT_MS = 8000;

export type AuthResult =
  | { ok: true; token: string; user: AuthUser }
  | { ok: false; error: string };

async function post(path: string, body: unknown): Promise<AuthResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as
      | { token?: string; user?: AuthUser; error?: string }
      | null;

    if (!res.ok || !data?.token || !data.user) {
      return {
        ok: false,
        error:
          data?.error ??
          'Impossible de joindre le serveur. Vérifie qu’il est lancé (npm run dev).',
      };
    }
    return { ok: true, token: data.token, user: data.user };
  } catch {
    return {
      ok: false,
      error: 'Serveur injoignable. Vérifie ta connexion et l’URL de l’API.',
    };
  } finally {
    clearTimeout(timer);
  }
}

export const registerAccount = (
  email: string,
  username: string,
  password: string
): Promise<AuthResult> => post('/auth/register', { email, username, password });

export const loginAccount = (
  email: string,
  password: string
): Promise<AuthResult> => post('/auth/login', { email, password });
