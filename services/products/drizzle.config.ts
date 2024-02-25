import type { Config } from 'drizzle-kit';
require('dotenv').config();

export default {
  schema: './src/repositories/db-schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_URL!,
  },
} satisfies Config;
