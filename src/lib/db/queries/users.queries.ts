"use server";

import { accounts } from "@/lib/db/schema/accounts.schema";
import { users } from "@/lib/db/schema/users.schema";
import { db } from "@/lib/drizzle";
import { TAccount, TBankId, TUserId } from "@/types";
import { eq } from "drizzle-orm";

export const getUsers = async () => {
  const result = await db.select().from(users);
  return result;
};

export const getUserById = async (id: TUserId) => {
  const [row] = await db.select().from(users).where(eq(users.id, id));
  return row;
};

export const getUserByEmail = async (email: string) => {
  const [row] = await db.select().from(users).where(eq(users.email, email));
  return row;
};

export const getUserWithCashAcctById = async (id: TUserId, cashId: TBankId) => {
  const cashAcct = db
    .select()
    .from(accounts)
    .where(eq(accounts.bankId, cashId))
    .as("cashAcct");

  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .leftJoin(cashAcct, eq(cashAcct.userId, users.id));
  if (!row) return null;
  const user = {
    ...row.users,
    account: row.cashAcct as TAccount | null,
  };
  return user;
};
