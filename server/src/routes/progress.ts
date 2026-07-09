import { Router } from 'express';
import { prisma } from '../prisma';
import { HttpError } from '../middlewares/errorHandler';

export const progressRouter = Router();

progressRouter.get('/:userId', async (req, res, next) => {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: { id: true },
    });

    if (!userExists) {
      next(new HttpError(404, 'Utilisateur introuvable'));
      return;
    }

    const progresses = await prisma.userProgress.findMany({
      where: { userId: req.params.userId },
      orderBy: { completedAt: 'asc' },
    });

    res.json(progresses);
  } catch (e) {
    next(e);
  }
});

progressRouter.post('/', async (req, res, next) => {
  try {
    const { userId, districtId, levelId, stars } = req.body ?? {};

    if (
      typeof userId !== 'string' ||
      userId.trim().length === 0 ||
      typeof districtId !== 'string' ||
      districtId.trim().length === 0 ||
      typeof levelId !== 'string' ||
      levelId.trim().length === 0 ||
      stars === undefined ||
      stars === null
    ) {
      next(
        new HttpError(
          400,
          'Requis : userId, districtId, levelId et stars (nombre)'
        )
      );
      return;
    }

    const starsNum = Number(stars);
    if (
      !Number.isInteger(starsNum) ||
      starsNum < 1 ||
      starsNum > 3
    ) {
      next(new HttpError(400, 'stars doit être un entier entre 1 et 3'));
      return;
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId.trim() },
      select: { id: true },
    });

    if (!userExists) {
      next(new HttpError(404, 'Utilisateur introuvable'));
      return;
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_levelId: {
          userId: userId.trim(),
          levelId: levelId.trim(),
        },
      },
      update: {
        stars: starsNum,
        districtId: districtId.trim(),
        completedAt: new Date(),
      },
      create: {
        userId: userId.trim(),
        districtId: districtId.trim(),
        levelId: levelId.trim(),
        stars: starsNum,
      },
    });

    res.status(201).json(progress);
  } catch (e) {
    next(e);
  }
});
