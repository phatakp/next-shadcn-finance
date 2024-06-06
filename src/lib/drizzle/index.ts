import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var _db: NeonHttpDatabase<Record<string, never>> | undefined;
}

let db: NeonHttpDatabase<Record<string, never>>;
export const client = neon(process.env.DATABASE_URL as string);

if (process.env.NODE_ENV === "production") {
  db = drizzle(client);
} else {
  if (!global._db) {
    global._db = drizzle(client);
  }
  db = global._db;
}

export { db };
