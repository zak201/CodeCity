import { Router } from 'express';

import { prisma } from '../prisma';
import { HttpError } from '../middlewares/errorHandler';
import { requireAuth, requireRole } from '../auth';

/**
 * Administration des utilisateurs — réservée au rôle `admin` (démonstration de
 * la gestion des rôles JWT). Le hash du mot de passe n'est jamais exposé.
 */
export const usersRouter = Router();

usersRouter.use(requireAuth, requireRole('admin'));

usersRouter.get('/', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        xp: true,
        level: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
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
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        xp: true,
        level: true,
        placementLevel: true,
        createdAt: true,
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
