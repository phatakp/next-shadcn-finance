import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: ".env",
});

export default defineConfig({
  schema: "./src/lib/db/schema/**/*.schema.ts",
  out: "./src/lib/db/migrations",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DB_AUTH_TOKEN,
  },
});
