import { Prisma } from '@prisma/client';
import { Router } from 'express';
import bcrypt from 'bcryptjs';

import { prisma } from '../prisma';
import { HttpError } from '../middlewares/errorHandler';
import { requireAuth, signToken } from '../auth';

/**
 * Authentification : inscription, connexion, profil courant.
 * Mots de passe hachés avec bcrypt ; jeton JWT renvoyé au client.
 */
export const authRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_ROUNDS = 10;

interface UserRow {
  id: string;
  username: string;
  email: string | null;
  role: string;
  xp: number;
  level: number;
  placementLevel: string | null;
}

/** Vue publique d'un utilisateur (jamais le hash du mot de passe). */
function publicUser(u: UserRow) {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    xp: u.xp,
    level: u.level,
    placementLevel: u.placementLevel,
  };
}

authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body ?? {};

    if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
      next(new HttpError(400, 'Email invalide'));
      return;
    }
    if (typeof username !== 'string' || username.trim().length < 2) {
      next(new HttpError(400, 'Nom d’utilisateur requis (2 caractères minimum)'));
      return;
    }
    if (typeof password !== 'string' || password.length < 6) {
      next(new HttpError(400, 'Mot de passe requis (6 caractères minimum)'));
      return;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: username.trim(),
        passwordHash,
        role: 'user',
        streak: { create: {} },
      },
    });

    const token = signToken({ userId: user.id, role: user.role });
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      next(new HttpError(409, 'Email ou nom d’utilisateur déjà utilisé'));
      return;
    }
    next(e);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      next(new HttpError(400, 'Email et mot de passe requis'));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    // Message générique : ne pas révéler si l'email existe.
    if (!user || !user.passwordHash) {
      next(new HttpError(401, 'Identifiants invalides'));
      return;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      next(new HttpError(401, 'Identifiants invalides'));
      return;
    }

    const token = signToken({ userId: user.id, role: user.role });
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    next(e);
  }
});

authRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      include: { progresses: true, streak: true },
    });
    if (!user) {
      next(new HttpError(404, 'Utilisateur introuvable'));
      return;
    }
    res.json({
      user: publicUser(user),
      progresses: user.progresses,
      streak: user.streak,
    });
  } catch (e) {
    next(e);
  }
});
