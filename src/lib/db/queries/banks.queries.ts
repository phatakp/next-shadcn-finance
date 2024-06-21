"use server";

import { banks } from "@/lib/db/schema/banks.schema";
import { db } from "@/lib/drizzle";
import { TAccountType, TBankId, TBankType } from "@/types";
import { and, eq } from "drizzle-orm";

export const getBanks = async (type?: TBankType) => {
  if (type) return await getBanksByType(type);
  const result = await db.select().from(banks);
  return result;
};

export const getBankById = async (id: TBankId) => {
  const [bank] = await db.select().from(banks).where(eq(banks.id, id));
  if (!bank) return null;
  return bank;
};

export const getBankByNameAndType = async (
  name: string,
  type: TAccountType
) => {
  const [bank] = await db
    .select()
    .from(banks)
    .where(and(eq(banks.name, name), eq(banks.type, type)));
  if (!bank) return null;
  return bank;
};

export const getBanksByType = async (type: TBankType) => {
  const result = await db.select().from(banks).where(eq(banks.type, type));
  return result;
};

export const getCashBank = async () => {
  const [cash] = await db.select().from(banks).where(eq(banks.name, "Cash"));
  return cash;
};
