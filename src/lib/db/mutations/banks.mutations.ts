"use server";

import { banks } from "@/lib/db/schema/banks.schema";
import { db } from "@/lib/drizzle";
import { NewBankSchema } from "@/lib/drizzle/zod-schemas";
import { handleError } from "@/lib/utils";
import { TActionResp, TBankId, TNewBankParams } from "@/types";
import { eq } from "drizzle-orm";

export const createBank = async (
  values: TNewBankParams
): Promise<TActionResp> => {
  try {
    const newBank = NewBankSchema.parse(values);
    const [bank] = await db.insert(banks).values(newBank).returning();
    return {
      success: true,
      message: `'${bank.name} ${bank.type}' created successfully`,
      id: bank.id,
    };
  } catch (err) {
    return handleError(err);
  }
};

export const deleteBank = async (id: TBankId): Promise<TActionResp> => {
  try {
    const [bank] = await db.delete(banks).where(eq(banks.id, id)).returning();
    return {
      success: true,
      message: `'${bank.name} ${bank.type}' deleted successfully`,
    };
  } catch (err) {
    return handleError(err);
  }
};
