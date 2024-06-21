import { accounts } from "@/lib/db/schema/accounts.schema";
import { groups } from "@/lib/db/schema/groups.schema";
import { transactions } from "@/lib/db/schema/transactions.schema";
import { users } from "@/lib/db/schema/users.schema";
import { db } from "@/lib/drizzle";
import { TFullTxn } from "@/types";
import { getUser } from "@workos-inc/authkit-nextjs";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { categories } from "../schema/categories.schema";

export const getTransactions = async () => {
  const { user } = await getUser({ ensureSignedIn: true });
  const dest = alias(accounts, "dest");

  const rows = await db
    .select({
      category: categories,
      source: accounts,
      destination: dest,
      user: users,
      group: groups,
      txn: transactions,
    })
    .from(transactions)
    .where(eq(transactions.userId, user.id!))
    .innerJoin(users, eq(transactions.userId, users.id))
    .innerJoin(categories, eq(categories.id, transactions.categoryId))
    .leftJoin(accounts, eq(transactions.sourceId, accounts.id))
    .leftJoin(dest, eq(transactions.destinationId, dest.id))
    .leftJoin(groups, eq(transactions.groupId, groups.id));
  const result = rows.map((r) => ({
    ...r.txn,
    category: r.category,
    source: r.source,
    destination: r.destination,
    group: r.group,
    user: r.user,
  }));
  return result as TFullTxn[];
};
