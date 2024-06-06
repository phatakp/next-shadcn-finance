"use server";

import { db } from "@/lib/drizzle";
import { NewTxnSchema } from "@/lib/drizzle/zod-schemas";
import { handleError } from "@/lib/utils";
import { TActionResp, TNewTxnParams } from "@/types";
import { getUser } from "@workos-inc/authkit-nextjs";
import { revalidatePath } from "next/cache";
import { transactions } from "../schema/transactions.schema";
import { creditAccount, debitAccount } from "./accounts.mutations";

const revalidateTransaction = () => {
  revalidatePath("/transactions");
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
};

export const createTransaction = async (
  account: TNewTxnParams
): Promise<TActionResp> => {
  const { user } = await getUser({ ensureSignedIn: true });

  try {
    const txn = await db.transaction(async (tx) => {
      const newTxn = NewTxnSchema.parse({
        ...account,
        userId: user.id,
        date: account.date.toISOString(),
        startDate: account.startDate
          ? account.startDate.toISOString()
          : undefined,
        endDate: account.endDate ? account.endDate.toISOString() : undefined,
      });
      console.log(newTxn);

      const [txn] = await tx.insert(transactions).values(newTxn).returning();
      if (txn.type !== "expense")
        await creditAccount(txn.destinationId!, txn.amount);
      if (txn.type !== "income") await debitAccount(txn.sourceId!, txn.amount);
      return txn;
    });
    revalidateTransaction();
    return {
      success: true,
      message: `${txn.type} for ${txn.amount} created successfully`,
      id: txn.id,
    };
  } catch (err) {
    return handleError(err);
  }
};
