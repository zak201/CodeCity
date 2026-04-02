import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.userProgress.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.user.deleteMany();

  const dayMs = 24 * 60 * 60 * 1000;
  const today = new Date();
  const yesterday = new Date(today.getTime() - dayMs);

  await prisma.user.create({
    data: {
      username: 'CodeArchitect01',
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
          { districtId: 'q1', levelId: 'q1-l01', stars: 3 },
          { districtId: 'q1', levelId: 'q1-l02', stars: 2 },
        ],
      },
    },
  });

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
        create: [{ districtId: 'q2', levelId: 'q2-l01', stars: 1 }],
      },
    },
  });

  await prisma.user.create({
    data: {
      username: 'StackRunner03',
      xp: 0,
      level: 1,
      placementLevel: null,
      streak: {
        create: {
          currentStreak: 0,
          longestStreak: 0,
          lastPlayedDate: null,
        },
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
