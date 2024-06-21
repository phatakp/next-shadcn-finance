"use server";

import { constants } from "@/lib/config/constants";
import { accounts } from "@/lib/db/schema/accounts.schema";
import { banks } from "@/lib/db/schema/banks.schema";
import { users } from "@/lib/db/schema/users.schema";
import { db } from "@/lib/drizzle";
import {
  TAccountId,
  TAccountType,
  TFullAccount,
  TInvestmentType,
  TransactionType,
} from "@/types";
import { getUser } from "@workos-inc/authkit-nextjs";
import { and, desc, eq, sql } from "drizzle-orm";
import { accountTypes, invTypes } from "../schema/enums.schema";

export const getAccounts = async () => {
  const { user } = await getUser({ ensureSignedIn: true });

  const rows = await db
    .select({ account: accounts, bank: banks, user: users })
    .from(accounts)
    .where(eq(accounts.userId, user.id!))
    .innerJoin(banks, eq(accounts.bankId, banks.id))
    .innerJoin(users, eq(accounts.userId, users.id))
    .orderBy(desc(accounts.isDefaultAcct));

  const result = rows.map((r) => ({
    ...r.account,
    bank: r.bank,
    user: r.user,
  }));

  return result as TFullAccount[];
};

export const getAccountsByType = async (type: TAccountType) => {
  const { user } = await getUser({ ensureSignedIn: true });

  const rows = await db
    .select({ account: accounts, bank: banks, user: users })
    .from(accounts)
    .where(and(eq(accounts.userId, user.id!), eq(accounts.type, type)))
    .innerJoin(banks, eq(accounts.bankId, banks.id))
    .innerJoin(users, eq(accounts.userId, users.id));
  const result = rows.map((r) => ({
    ...r.account,
    bank: r.bank,
    user: r.user,
  }));
  return result as TFullAccount[];
};

export const getAccountById = async (id: TAccountId) => {
  const { user } = await getUser({ ensureSignedIn: true });

  const [row] = await db
    .select({ account: accounts, bank: banks, user: users })
    .from(accounts)
    .where(and(eq(accounts.id, id), eq(accounts.userId, user.id)))
    .innerJoin(banks, eq(accounts.bankId, banks.id))
    .innerJoin(users, eq(accounts.userId, users.id));
  if (row === undefined) return null;
  const account = { ...row.account, bank: row.bank, user: row.user };
  return account as TFullAccount;
};

export async function getAccountTypeTotals() {
  const { user } = await getUser({ ensureSignedIn: true });
  const types = await db
    .select({
      type: accounts.type,
      totalBalance: sql<number>`cast(sum(${accounts.balance}) as float)`,
      totalValue: sql<number>`cast(sum(${accounts.currValue}) as float)`,
      count: sql<number>`cast(count(${accounts.id}) as int)`,
    })
    .from(accounts)
    .where(eq(accounts.userId, user.id))
    .groupBy(accounts.type);

  constants.acctTypes.forEach((opt) => {
    const total = types.find((t) => t.type === opt);
    if (!total)
      types.push({ type: opt, totalBalance: 0, totalValue: 0, count: 0 });
  });

  const totals = types.map((t) => ({
    ...t,
    isAsset: !["mortgage", "credit-card"].includes(t.type),
  }));

  const assets = totals
    .filter((tot) => tot.isAsset)
    .reduce((acc, b) => acc + b.totalValue, 0);
  const assetInvested = totals
    .filter((tot) => tot.isAsset)
    .reduce((acc, b) => acc + b.totalBalance, 0);
  const liabilities = totals
    .filter((tot) => !tot.isAsset)
    .reduce((acc, b) => acc + b.totalBalance, 0);

  const networth = assets - liabilities;

  return { totals, assets, liabilities, networth, assetInvested };
}

export async function getInvestmentTypeTotals() {
  const { user } = await getUser({ ensureSignedIn: true });
  const totals = await db
    .select({
      type: accounts.invType,
      totalBalance: sql<number>`cast(sum(${accounts.balance}) as float)`,
      totalValue: sql<number>`cast(sum(${accounts.currValue}) as float)`,
      count: sql<number>`cast(count(${accounts.id}) as int)`,
    })
    .from(accounts)
    .where(and(eq(accounts.userId, user.id), eq(accounts.type, "investment")))
    .groupBy(accounts.invType);

  constants.invTypes.forEach((opt) => {
    const total = totals.find((t) => t.type === opt);
    if (!total)
      totals.push({ type: opt, totalBalance: 0, totalValue: 0, count: 0 });
  });

  const equity = totals.find((t) => t.type === "equity");
  const fund = totals.find((t) => t.type === "fund");
  const fd = totals.find((t) => t.type === "fd");
  return { equity, fund, fd };
}

export async function getTxnTypeAccounts(
  type: TransactionType,
  sourceId?: number,
  isDestination?: boolean
) {
  const accounts = await getAccounts();
  // Only allow transactions from Savings/Credit-Card/Wallet accounts
  const result = accounts.filter(
    (acct) => !["mortgage", "investment"].includes(acct.type)
  );
  if (sourceId && isDestination)
    return result.filter((acct) => acct.id !== sourceId);
  return result;
}

export async function getBalance(id: TAccountId) {
  const [acct] = await db.select().from(accounts).where(eq(accounts.id, id));

  return acct?.balance ?? 0;
}

export async function getAcctType(type: TAccountType) {
  const [result] = await db
    .select()
    .from(accountTypes)
    .where(eq(accountTypes.type, type));

  return result.type;
}

export async function getInvType(type: TInvestmentType) {
  const [result] = await db
    .select()
    .from(invTypes)
    .where(eq(invTypes.type, type));

  return result.type;
}
