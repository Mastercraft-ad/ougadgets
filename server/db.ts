import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "NEON_DATABASE_URL or DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Ensure the connection string has the proper protocol prefix
if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
  connectionString = `postgresql://${connectionString}`;
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
