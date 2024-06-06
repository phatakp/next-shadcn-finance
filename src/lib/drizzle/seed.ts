"use server";

import "dotenv/config";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";

import { banks } from "@/lib/db/schema/banks.schema";
import { categories } from "@/lib/db/schema/categories.schema";
import { TBankType, TNewBank, TNewCategory } from "@/types";
import { neon } from "@neondatabase/serverless";
import { bankData } from "./data/banks";
import { categoriesData } from "./data/categories";

async function loadCategories(db: NeonHttpDatabase<Record<string, never>>) {
  await db.delete(categories);
  await db.insert(categories).values(categoriesData as TNewCategory[]);
}

async function loadBanks(db: NeonHttpDatabase<Record<string, never>>) {
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
  let db: NeonHttpDatabase<Record<string, never>>;

  console.log("⏳ Running seed...");
  const start = Date.now();

  const migrationClient = neon(process.env.DATABASE_URL as string);
  db = drizzle(migrationClient);
  await loadBanks(db);
  await loadCategories(db);

  const end = Date.now();
  console.log("✅ Seeding completed in", end - start, "ms");

  process.exit(0);
};

main().catch((err) => {
  console.error("❌ Seed failed");
  console.error(err);
  process.exit(1);
});
