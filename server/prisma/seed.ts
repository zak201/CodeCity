import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Mot de passe commun aux comptes de démonstration (voir README).
const DEMO_PASSWORD = 'codecity123';

async function main(): Promise<void> {
  await prisma.userProgress.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.user.deleteMany();

  const dayMs = 24 * 60 * 60 * 1000;
  const today = new Date();
  const yesterday = new Date(today.getTime() - dayMs);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // Compte ADMIN de démo (gestion des rôles JWT) : peut lister /api/users.
  await prisma.user.create({
    data: {
      username: 'Admin',
      email: 'admin@codecity.dev',
      passwordHash,
      role: 'admin',
      xp: 0,
      level: 1,
    },
  });

  // Compte JOUEUR de démo (connexion + synchro de la progression).
  await prisma.user.create({
    data: {
      username: 'CodeArchitect01',
      email: 'player@codecity.dev',
      passwordHash,
      role: 'user',
      xp: 240,
      level: 4,
      placementLevel: 'beginner',
      streak: {
        create: {
          currentStreak: 5,
          longestStreak: 12,
          lastPlayedDate: yesterday,
        },
      },
      progresses: {
        create: [
          { districtId: 'q1', levelId: 'q1-c1-l01', stars: 3 },
          { districtId: 'q1', levelId: 'q1-c1-l02', stars: 2 },
        ],
      },
    },
  });

  // Comptes anonymes (données seules, sans identifiants).
  await prisma.user.create({
    data: {
      username: 'ByteNomad02',
      xp: 90,
      level: 2,
      placementLevel: 'absolute-beginner',
      streak: {
        create: {
          currentStreak: 1,
          longestStreak: 4,
          lastPlayedDate: today,
        },
      },
      progresses: {
        create: [{ districtId: 'q2', levelId: 'q2-c1-l01', stars: 1 }],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
