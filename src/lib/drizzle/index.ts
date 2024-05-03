import "dotenv/config";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var _db: PostgresJsDatabase<Record<string, never>> | undefined;
}

let db: PostgresJsDatabase<Record<string, never>>;
export const client = postgres(process.env.DATABASE_URL as string);

if (process.env.NODE_ENV === "production") {
  db = drizzle(client);
} else {
  if (!global._db) {
    global._db = drizzle(client);
  }
  db = global._db;
}

export { db };
