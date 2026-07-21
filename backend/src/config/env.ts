import 'dotenv/config';

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error('PORT must be a positive integer.');
}

// Validate database URLs (only in production)
const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

const nodeEnv = process.env.NODE_ENV ?? 'development';

if (nodeEnv === 'production') {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required in production environment variables.');
  }
  if (!directUrl) {
    throw new Error('DIRECT_URL is required in production environment variables.');
  }
}

export const env = {
  nodeEnv,
  port,
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:4200',
  jwtSecret: process.env.JWT_SECRET ?? 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
  databaseUrl: databaseUrl || '',
  directUrl: directUrl || '',
};
