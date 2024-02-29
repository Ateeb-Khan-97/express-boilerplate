import { isDev } from './env.util';

import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

if (!(global as any).db) {
  (global as any).db = new PrismaClient({
    log: isDev() ? ['error', 'info', 'query', 'warn'] : undefined,
  });
}

db = (global as any).db as PrismaClient;
export default db;
