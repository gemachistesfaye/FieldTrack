import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development hot-reloading
export const prisma: PrismaClient =
  globalThis.__prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: env.databaseUrl,
      },
    },
    log: env.nodeEnv === 'development' ? ['warn'] : ['error'],
  });

if (env.nodeEnv !== 'production') {
  globalThis.__prisma = prisma;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
