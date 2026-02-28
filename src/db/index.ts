import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  _db?: ReturnType<typeof drizzle>;
};

function createDb() {
  const sqlite = new Database(process.env.DATABASE_URL ?? "./local.db");
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzle(sqlite, { schema });
}

export const db = globalForDb._db ?? (globalForDb._db = createDb());
