import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  real,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { accounts } from "./accounts.schema";
import { categories } from "./categories.schema";
import { frequencyEnum, txnTypeEnum } from "./enums.schema";
import { groups } from "./groups.schema";
import { users } from "./users.schema";

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    date: date("date").notNull(),
    description: varchar("description", { length: 255 }),
    type: txnTypeEnum("txn_type").notNull().default("expense"),
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
    isRecurring: boolean("is_recurring").default(false),
    frequency: frequencyEnum("frequency"),
    startDate: date("start_date", { mode: "date" }),
    endDate: date("end_date", { mode: "date" }),
  },
  (txns) => {
    return {
      txnTypeIndex: index("txn_type_idx").on(txns.type),
      txnCatIndex: index("txn_category_idx").on(txns.categoryId),
    };
  }
);
