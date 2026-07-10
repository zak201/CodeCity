import { Router } from 'express';

import { prisma } from '../prisma';
import { HttpError } from '../middlewares/errorHandler';
import { requireAuth } from '../auth';

/**
 * Données de l'utilisateur AUTHENTIFIÉ (dérivées du token, jamais d'un id
 * fourni par le client). Toutes les routes sont protégées par JWT.
 */
export const meRouter = Router();

meRouter.use(requireAuth);

/** Met à jour XP / niveau / placement du joueur connecté. */
meRouter.patch('/', async (req, res, next) => {
  try {
    const { xp, level, placementLevel } = req.body ?? {};
    const data: { xp?: number; level?: number; placementLevel?: string | null } =
      {};

    if (xp !== undefined) {
      if (!Number.isInteger(xp) || xp < 0) {
        next(new HttpError(400, 'xp doit être un entier positif ou nul'));
        return;
      }
      data.xp = xp;
    }
    if (level !== undefined) {
      if (!Number.isInteger(level) || level < 1) {
        next(new HttpError(400, 'level doit être un entier ≥ 1'));
        return;
      }
      data.level = level;
    }
    if (placementLevel !== undefined) {
      if (placementLevel !== null && typeof placementLevel !== 'string') {
        next(new HttpError(400, 'placementLevel doit être une chaîne ou null'));
        return;
      }
      data.placementLevel = placementLevel;
    }

    const user = await prisma.user.update({
      where: { id: req.auth!.userId },
      data,
    });
    res.json({
      id: user.id,
      xp: user.xp,
      level: user.level,
      placementLevel: user.placementLevel,
    });
  } catch (e) {
    next(e);
  }
});

/** Niveaux complétés du joueur connecté. */
meRouter.get('/progress', async (req, res, next) => {
  try {
    const progresses = await prisma.userProgress.findMany({
      where: { userId: req.auth!.userId },
    });
    res.json(progresses);
  } catch (e) {
    next(e);
  }
});

/** Enregistre / actualise la complétion d'un niveau (upsert). */
meRouter.post('/progress', async (req, res, next) => {
  try {
    const { districtId, levelId, stars } = req.body ?? {};
    if (typeof districtId !== 'string' || typeof levelId !== 'string') {
      next(new HttpError(400, 'districtId et levelId sont requis'));
      return;
    }
    if (!Number.isInteger(stars) || stars < 1 || stars > 3) {
      next(new HttpError(400, 'stars doit être un entier entre 1 et 3'));
      return;
    }
    const userId = req.auth!.userId;
    const progress = await prisma.userProgress.upsert({
      where: { userId_levelId: { userId, levelId } },
      update: { stars, districtId },
      create: { userId, districtId, levelId, stars },
    });
    res.status(201).json(progress);
  } catch (e) {
    next(e);
  }
});

/** Met à jour la série (streak) du joueur connecté. */
meRouter.put('/streak', async (req, res, next) => {
  try {
    const { currentStreak, longestStreak, lastPlayedDate } = req.body ?? {};
    if (
      !Number.isInteger(currentStreak) ||
      currentStreak < 0 ||
      !Number.isInteger(longestStreak) ||
      longestStreak < 0
    ) {
      next(
        new HttpError(
          400,
          'currentStreak et longestStreak doivent être des entiers positifs ou nuls'
        )
      );
      return;
    }
    if (
      lastPlayedDate !== null &&
      (typeof lastPlayedDate !== 'string' ||
        Number.isNaN(new Date(lastPlayedDate).getTime()))
    ) {
      next(new HttpError(400, 'lastPlayedDate doit être une date ISO ou null'));
      return;
    }

    const userId = req.auth!.userId;
    const playedAt = lastPlayedDate === null ? null : new Date(lastPlayedDate);
    const streak = await prisma.streak.upsert({
      where: { userId },
      update: { currentStreak, longestStreak, lastPlayedDate: playedAt },
      create: { userId, currentStreak, longestStreak, lastPlayedDate: playedAt },
    });
    res.json(streak);
  } catch (e) {
    next(e);
  }
});
