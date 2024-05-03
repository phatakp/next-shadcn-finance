import { db } from "@/lib/drizzle";
import { NewTxnSchema } from "@/lib/drizzle/zod-schemas";
import { handleError } from "@/lib/utils";
import { TActionResp, TNewTxnParams } from "@/types";
import { getUser } from "@workos-inc/authkit-nextjs";
import { revalidatePath } from "next/cache";
import { transactions } from "../schema/transactions.schema";

const revalidateTransaction = () => {
  revalidatePath("/transactions");
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
};

export const createTransactions = async (
  account: TNewTxnParams
): Promise<TActionResp> => {
  const { user } = await getUser({ ensureSignedIn: true });

  try {
    const newTxn = NewTxnSchema.parse(account);
    const [txn] = await db
      .insert(transactions)
      .values({
        ...newTxn,
        userId: user.id,
      })
      .returning();
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
