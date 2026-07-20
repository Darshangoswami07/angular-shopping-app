import { PrismaClient } from '../../generated/prisma/client.js';
import 'dotenv/config';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient(
  process.env.DATABASE_URL ? { accelerateUrl: process.env.DATABASE_URL as string } : {} as any
);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
