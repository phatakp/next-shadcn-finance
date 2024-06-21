import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { banks } from "./banks.schema";
import { accountTypes, invTypes } from "./enums.schema";
import { users } from "./users.schema";

export const accounts = sqliteTable(
  "accounts",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    number: text("number").notNull(),
    name: text("name").notNull(),
    type: text("type")
      .references(() => accountTypes.type, { onDelete: "cascade" })
      .notNull(),
    balance: real("balance").notNull().default(0),
    isDefaultAcct: integer("is_default", { mode: "boolean" }).default(false),
    asOfDate: text("as_of_date"),
    bankId: integer("bank_id")
      .references(() => banks.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    //Investment account fields
    currValue: real("curr_value").notNull().default(0),
    invType: text("inv_type").references(() => invTypes.type, {
      onDelete: "set null",
    }),
    isSIP: integer("is_sip", { mode: "boolean" }).default(false),

    // Fields for mutual funds only
    nav: real("nav").default(0),
    units: real("units").default(0),

    // Fields for stock only
    buyPrice: real("buy_price").default(0),
    currPrice: real("curr_price").default(0),
    quantity: integer("quantity").default(0),
    moneyControlPrefix: text("money_control_prefix"),
  },
  (accounts) => {
    return {
      accountIndex: uniqueIndex("account_idx").on(
        accounts.number,
        accounts.bankId,
        accounts.userId
      ),
      accountTypeIndex: index("account_type_idx").on(accounts.type),
    };
  }
);
