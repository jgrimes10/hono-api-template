import env from '@/env';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

/** The client object. */
const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

/** The database object. */
const db = drizzle(client, {
  schema,
});

export default db;
