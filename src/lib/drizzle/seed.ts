"use server";

import { constants } from "@/lib/config/constants";
import { accounts } from "@/lib/db/schema/accounts.schema";
import { banks } from "@/lib/db/schema/banks.schema";
import { categories } from "@/lib/db/schema/categories.schema";
import {
  TAccountType,
  TInvestmentType,
  TNewAccount,
  TNewBank,
  TNewCategory,
} from "@/types";
import { createClient } from "@libsql/client";
import "dotenv/config";
import { ne } from "drizzle-orm";
import { LibSQLDatabase, drizzle } from "drizzle-orm/libsql";
import { getAcctType, getInvType } from "../db/queries/accounts.queries";
import { getBankByNameAndType } from "../db/queries/banks.queries";
import { getUserByEmail } from "../db/queries/users.queries";
import {
  accountTypes,
  frequency,
  invTypes,
  parentCategories,
  txnTypes,
} from "../db/schema/enums.schema";
import { acctData } from "./data/accounts";
import { bankData } from "./data/banks";
import { categoriesData } from "./data/categories";

async function loadEnums(db: LibSQLDatabase<Record<string, never>>) {
  await db.delete(accountTypes);
  await db.delete(invTypes);
  await db.delete(txnTypes);
  await db.delete(parentCategories);
  await db.delete(frequency);
  await db
    .insert(accountTypes)
    .values(constants.acctTypes.map((a) => ({ type: a })));
  await db
    .insert(invTypes)
    .values(constants.invTypes.map((a) => ({ type: a })));
  await db
    .insert(txnTypes)
    .values(constants.txnTypes.map((a) => ({ type: a })));
  await db
    .insert(frequency)
    .values(constants.frequency.map((a) => ({ type: a })));
  await db
    .insert(parentCategories)
    .values(constants.parentCategories.map((a) => ({ parent: a })));
  console.log("Enums loaded");
}

async function loadCategories(db: LibSQLDatabase<Record<string, never>>) {
  await db.delete(categories);
  await db.insert(categories).values(categoriesData as TNewCategory[]);
  console.log("Categories loaded");
}

async function loadBanks(db: LibSQLDatabase<Record<string, never>>) {
  const values: TNewBank[] = [];
  for (const bank of bankData) {
    const acctType = await getAcctType(bank.type as TAccountType);
    for (const name of bank.names) {
      values.push({ type: acctType, name });
    }
  }

  await db.delete(banks);
  await db.insert(banks).values(values);
  console.log("Banks loaded");
}

async function loadAccounts(db: LibSQLDatabase<Record<string, never>>) {
  const user = await getUserByEmail("praveenphatak@gmail.com");
  if (!user) throw new Error("User not found");

  const values: TNewAccount[] = [];

  for (const acct of acctData) {
    const acctType = await getAcctType(acct.type as TAccountType);
    const bank = await getBankByNameAndType(
      acct.bank,
      acctType as TAccountType
    );
    if (!bank) throw new Error("Bank not found");
    let invType;
    if (acct.invType)
      invType = await getInvType(acct.invType as TInvestmentType);
    values.push({
      number: acct.number,
      name: acct.name,
      balance: acct.balance,
      currValue: acct.currValue,
      asOfDate: acct.asOfDate,
      userId: user.id,
      bankId: bank.id,
      type: acctType,
      invType,
      isSIP: !!acct?.isSip,
      units: acct?.units ?? 0,
    });
  }
  await db.delete(accounts).where(ne(accounts.name, "Cash Available"));
  await db.insert(accounts).values(values);
  console.log("Accounts loaded");
}

const main = async () => {
  if (!process.env.DATABASE_URL || !process.env.DB_AUTH_TOKEN) {
    throw new Error("DATABASE_URL/TOKEN is not defined");
  }

  // Could not import from drizzle.ts due to mts v ts compatibility issues
  let db: LibSQLDatabase<Record<string, never>>;

  console.log("⏳ Running seed...");
  const start = Date.now();

  const migrationClient = createClient({
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DB_AUTH_TOKEN,
  });
  db = drizzle(migrationClient);
  // await loadEnums(db);
  // await loadBanks(db);
  // await loadCategories(db);
  await loadAccounts(db);

  const end = Date.now();
  console.log("✅ Seeding completed in", end - start, "ms");
  process.exit(0);
};

main().catch((err) => {
  console.error("❌ Seed failed");
  console.error(err);
  process.exit(1);
});
