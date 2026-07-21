import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!databaseUrl && process.env.NODE_ENV === 'development') {
  console.warn('⚠️  DATABASE_URL not set. Using placeholder for development.');
}

const connectionString = databaseUrl || 'postgresql://localhost:5432/postgres';

const adapter = new PrismaPg(connectionString);

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
