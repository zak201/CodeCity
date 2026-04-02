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
