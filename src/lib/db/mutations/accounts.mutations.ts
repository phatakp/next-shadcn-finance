"use server";

import { getAccountsByType } from "@/lib/db/queries/accounts.queries";
import { accounts } from "@/lib/db/schema/accounts.schema";
import { db } from "@/lib/drizzle";
import {
  NewAccountParams,
  UpdateAccountSchema,
} from "@/lib/drizzle/zod-schemas";
import { getStockData } from "@/lib/stock";
import { handleError } from "@/lib/utils";
import {
  TAccountId,
  TAccountType,
  TActionResp,
  TMFAPIData,
  TNewAccountParams,
  TUpdateAccountParams,
} from "@/types";
import { getUser } from "@workos-inc/authkit-nextjs";
import { format } from "date-fns";
import { AnyColumn, and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const increment = (column: AnyColumn, value = 0) => {
  return sql`${column} + ${value}`;
};

const decrement = (column: AnyColumn, value = 0) => {
  return sql`${column} - ${value}`;
};

const revalidateAccount = (type?: TAccountType) => {
  revalidatePath(`/accounts?type=${type ?? "savings"}`);
  revalidatePath("/dashboard");
};

export const createCashAccountForUser = async (
  userId: string,
  bankId: number
): Promise<TActionResp> => {
  if (!userId || !bankId)
    return { success: false, message: "Invalid Parameters" };

  try {
    const [acct] = await db
      .insert(accounts)
      .values({ name: "Cash Available", number: "000000", bankId, userId })
      .returning();
    revalidateAccount();
    return {
      success: true,
      message: `Account ${acct.name} created successfully`,
    };
  } catch (err) {
    return handleError(err);
  }
};

export const createAccount = async (
  account: TNewAccountParams
): Promise<TActionResp> => {
  const { user } = await getUser({ ensureSignedIn: true });

  try {
    const { bankSelect, ...newAccount } = NewAccountParams.parse(account);
    const [acct] = await db
      .insert(accounts)
      .values({ ...newAccount, userId: user.id })
      .returning();
    revalidateAccount(acct.type);
    return {
      success: true,
      message: `Account ${acct.name} created successfully`,
      id: acct.id,
    };
  } catch (err) {
    return handleError(err);
  }
};

export const updateAccount = async (account: TUpdateAccountParams) => {
  const { user } = await getUser({ ensureSignedIn: true });

  try {
    const { id, bankSelect, ...updAcct } = UpdateAccountSchema.parse(account);
    const [acct] = await db
      .update(accounts)
      .set(updAcct)
      .where(and(eq(accounts.id, id), eq(accounts.userId, user.id)))
      .returning();
    revalidateAccount(acct.type);
    return {
      success: true,
      message: `Account ${acct.name} updated successfully`,
    };
  } catch (err) {
    return handleError(err);
  }
};

export const deleteAccount = async (id: TAccountId) => {
  const { user } = await getUser({ ensureSignedIn: true });

  try {
    const [acct] = await db
      .delete(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.userId, user.id)))
      .returning();
    revalidateAccount(acct.type);
    return {
      success: true,
      message: `Account ${acct.name} deleted successfully`,
    };
  } catch (err) {
    return handleError(err);
  }
};

export async function refreshBalances() {
  const { user } = await getUser({ ensureSignedIn: true });

  try {
    const investmentAccounts = await getAccountsByType("investment");
    investmentAccounts.forEach(async (acct) => {
      if (acct.invType === "fund") {
        const resp = await fetch(`/api/mf-details?code=${acct.number}`);
        const { data: fund }: { data: TMFAPIData } = await resp.json();
        const nav = parseFloat(fund?.data?.[0]?.nav ?? "0");
        const currValue = acct?.units ?? 0 * nav;
        await db
          .update(accounts)
          .set({ nav, currValue, asOfDate: format(new Date(), "MM/dd/yyyy") })
          .where(and(eq(accounts.id, acct.id), eq(accounts.userId, user.id)));
      } else if (acct.invType === "equity") {
        const equity = await getStockData(
          acct?.moneyControlPrefix,
          acct.number
        );

        const currPrice = equity?.price ?? 0;
        const currValue = acct?.quantity ?? 0 * currPrice;
        await db
          .update(accounts)
          .set({
            currPrice,
            currValue,
            asOfDate: format(new Date(), "MM/dd/yyyy"),
          })
          .where(and(eq(accounts.id, acct.id), eq(accounts.userId, user.id)));
      }
    });
    revalidateAccount();
    return {
      success: true,
      message: `Account balances refreshed successfully`,
    };
  } catch (err) {
    return handleError(err);
  }
}

export async function debitAccount(id: TAccountId, amt: number) {
  try {
    const [acct] = await db.select().from(accounts).where(eq(accounts.id, id));
    if (!acct)
      return {
        success: false,
        message: `Account not found`,
      };

    switch (acct.type) {
      case "credit-card":
        await db
          .update(accounts)
          .set({
            balance: increment(accounts.balance, amt),
            currValue: increment(accounts.currValue, amt),
          })
          .where(eq(accounts.id, id));
        break;

      case "savings":
      case "wallet":
        await db
          .update(accounts)
          .set({
            balance: decrement(accounts.balance, amt),
            currValue: decrement(accounts.currValue, amt),
          })
          .where(eq(accounts.id, id));
        break;

      default:
        break;
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function creditAccount(id: TAccountId, amt: number) {
  try {
    const [acct] = await db.select().from(accounts).where(eq(accounts.id, id));
    if (!acct)
      return {
        success: false,
        message: `Account not found`,
      };

    switch (acct.type) {
      case "credit-card":
        await db
          .update(accounts)
          .set({
            balance: decrement(accounts.balance, amt),
            currValue: decrement(accounts.currValue, amt),
          })
          .where(eq(accounts.id, id));
        break;

      case "savings":
      case "wallet":
        await db
          .update(accounts)
          .set({
            balance: increment(accounts.balance, amt),
            currValue: increment(accounts.currValue, amt),
          })
          .where(eq(accounts.id, id));
        break;

      default:
        break;
    }
  } catch (error) {
    return handleError(error);
  }
}
