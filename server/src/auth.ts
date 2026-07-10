import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { HttpError } from './middlewares/errorHandler';

/**
 * Socle d'authentification JWT.
 *
 * - `signToken` émet un jeton signé (HS256) portant l'id et le rôle.
 * - `requireAuth` vérifie le `Authorization: Bearer <token>` et attache
 *   `req.auth` ; renvoie 401 si absent / invalide / expiré.
 * - `requireRole` restreint une route à un rôle (ex. `admin`).
 *
 * Le secret vient de `JWT_SECRET` (server/.env). Un défaut est prévu pour le
 * développement, mais un vrai secret DOIT être défini en production.
 */

const JWT_SECRET: string = process.env.JWT_SECRET || 'codecity-dev-secret-change-me';
const TOKEN_TTL = '7d';

export interface AuthPayload {
  userId: string;
  role: string;
}

// Étend le type Request d'Express pour porter l'utilisateur authentifié.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(new HttpError(401, 'Authentification requise'));
    return;
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.auth = { userId: decoded.userId, role: decoded.role };
    next();
  } catch {
    next(new HttpError(401, 'Token invalide ou expiré'));
  }
};

export function requireRole(role: string): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) {
      next(new HttpError(401, 'Authentification requise'));
      return;
    }
    if (req.auth.role !== role) {
      next(new HttpError(403, `Accès réservé au rôle « ${role} »`));
      return;
    }
    next();
  };
}
