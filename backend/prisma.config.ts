import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // For Supabase, use DIRECT_URL for migrations (direct connection without pooler)
    url: env('DIRECT_URL'),
  },
});
