import { createClient } from "@libsql/client";
import "dotenv/config";
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var _db: LibSQLDatabase<Record<string, never>> | undefined;
}

let db: LibSQLDatabase<Record<string, never>>;
export const client = createClient({
  url: process.env.DATABASE_URL as string,
  authToken: process.env.DB_AUTH_TOKEN,
});

if (process.env.NODE_ENV === "production") {
  db = drizzle(client);
} else {
  if (!global._db) {
    global._db = drizzle(client);
  }
  db = global._db;
}

export { db };
