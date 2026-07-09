import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { prisma } from '../prisma';
import { HttpError } from '../middlewares/errorHandler';

export const usersRouter = Router();

usersRouter.get('/', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        xp: true,
        level: true,
      },
    });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

usersRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        progresses: true,
        streak: true,
      },
    });

    if (!user) {
      next(new HttpError(404, 'Utilisateur introuvable'));
      return;
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
});

usersRouter.post('/', async (req, res, next) => {
  try {
    const username = req.body?.username;

    if (typeof username !== 'string' || username.trim().length === 0) {
      next(new HttpError(400, 'Le champ username est requis'));
      return;
    }

    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        streak: {
          create: {},
        },
      },
      include: {
        progresses: true,
        streak: true,
      },
    });

    res.status(201).json(user);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      next(new HttpError(409, 'Ce nom d’utilisateur est déjà pris'));
      return;
    }
    next(e);
  }
});

usersRouter.patch('/:id', async (req, res, next) => {
  try {
    const { xp, level, placementLevel } = req.body ?? {};

    const data: Prisma.UserUpdateInput = {};

    if (xp !== undefined) {
      if (!Number.isInteger(xp) || xp < 0) {
        next(new HttpError(400, 'xp doit être un entier positif ou nul'));
        return;
      }
      data.xp = xp;
    }

    if (level !== undefined) {
      if (!Number.isInteger(level) || level < 1) {
        next(new HttpError(400, 'level doit être un entier supérieur ou égal à 1'));
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

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });

    if (!user) {
      next(new HttpError(404, 'Utilisateur introuvable'));
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data,
      include: {
        progresses: true,
        streak: true,
      },
    });

    res.json(updated);
  } catch (e) {
    next(e);
  }
});

usersRouter.put('/:id/streak', async (req, res, next) => {
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
      next(
        new HttpError(
          400,
          'lastPlayedDate doit être une date ISO (chaîne) ou null'
        )
      );
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });

    if (!user) {
      next(new HttpError(404, 'Utilisateur introuvable'));
      return;
    }

    const playedAt = lastPlayedDate === null ? null : new Date(lastPlayedDate);

    const streak = await prisma.streak.upsert({
      where: { userId: req.params.id },
      update: {
        currentStreak,
        longestStreak,
        lastPlayedDate: playedAt,
      },
      create: {
        userId: req.params.id,
        currentStreak,
        longestStreak,
        lastPlayedDate: playedAt,
      },
    });

    res.json(streak);
  } catch (e) {
    next(e);
  }
});
