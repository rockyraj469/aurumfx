import type { Config } from 'drizzle-kit';

export default {
  schema: './shared/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
 dbCredentials: {
  url: process.env.DATABASE_URL || "./data.db",
},
} satisfies Config;