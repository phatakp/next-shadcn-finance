"use server";

import "dotenv/config";
import {
  drizzle as LocalDrizzle,
  type PostgresJsDatabase,
} from "drizzle-orm/postgres-js";

import { banks } from "@/lib/db/schema/banks.schema";
import { categories } from "@/lib/db/schema/categories.schema";
import { TBankType, TNewBank, TNewCategory } from "@/types";
import postgres from "postgres";
import { bankData } from "./data/banks";
import { categoriesData } from "./data/categories";

async function loadCategories(db: PostgresJsDatabase<Record<string, never>>) {
  await db.delete(categories);
  await db.insert(categories).values(categoriesData as TNewCategory[]);
}

async function loadBanks(db: PostgresJsDatabase<Record<string, never>>) {
  const values: TNewBank[] = [];
  for (const bank of bankData) {
    const { type, names } = bank;
    for (const name of names) {
      values.push({ type: type as TBankType, name });
    }
  }

  await db.delete(banks);
  await db.insert(banks).values(values);
}

const main = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  // Could not import from drizzle.ts due to mts v ts compatibility issues
  let db: PostgresJsDatabase<Record<string, never>>;

  console.log("⏳ Running seed...");
  const start = Date.now();

  const migrationClient = postgres(process.env.DATABASE_URL as string, {
    max: 1,
  });
  db = LocalDrizzle(migrationClient);
  await loadBanks(db);
  await loadCategories(db);
  await migrationClient.end();

  const end = Date.now();
  console.log("✅ Seeding completed in", end - start, "ms");

  process.exit(0);
};

main().catch((err) => {
  console.error("❌ Seed failed");
  console.error(err);
  process.exit(1);
});
