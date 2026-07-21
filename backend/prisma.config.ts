import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const datasourceUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'production' && !datasourceUrl) {
  throw new Error('Either DIRECT_URL or DATABASE_URL must be set in production environment variables');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // For Supabase, use DIRECT_URL for migrations (direct connection without pooler)
    // Fall back to DATABASE_URL if DIRECT_URL is not set
    url: datasourceUrl || 'postgresql://localhost:5432/postgres',
  },
});
