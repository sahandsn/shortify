import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import { env } from "@/env";
import * as schema from "./schema";

/**
 * Cache the Neon connection in development. This avoids creating new connections on HMR updates.
 */
const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof neon> | undefined;
};

const conn = globalForDb.conn ?? neon(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });