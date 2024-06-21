import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { accounts } from "./accounts.schema";
import { categories } from "./categories.schema";
import { frequency, txnTypes } from "./enums.schema";
import { groups } from "./groups.schema";
import { users } from "./users.schema";

export const transactions = sqliteTable(
  "transactions",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    date: integer("date", { mode: "timestamp" }).notNull(),
    description: text("description"),
    type: text("type")
      .references(() => txnTypes.type, { onDelete: "cascade" })
      .notNull()
      .default("expense"),
    amount: real("amount").notNull().default(0),
    categoryId: integer("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    sourceId: integer("source_id").references(() => accounts.id, {
      onDelete: "cascade",
    }),
    destinationId: integer("destination_id").references(() => accounts.id, {
      onDelete: "cascade",
    }),
    groupId: integer("group_id").references(() => groups.id, {
      onDelete: "cascade",
    }),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    //Recurring transaction fields
    isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
    frequency: text("frequency").references(() => frequency.type, {
      onDelete: "set null",
    }),
    startDate: integer("start_date", { mode: "timestamp" }),
    endDate: integer("end_date", { mode: "timestamp" }),
  },
  (txns) => {
    return {
      txnTypeIndex: index("txn_type_idx").on(txns.type),
      txnCatIndex: index("txn_category_idx").on(txns.categoryId),
    };
  }
);
