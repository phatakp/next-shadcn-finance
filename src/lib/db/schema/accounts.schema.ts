import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  serial,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { banks } from "./banks.schema";
import { bankTypeEnum, invTypeEnum } from "./enums.schema";
import { users } from "./users.schema";

export const accounts = pgTable(
  "accounts",
  {
    id: serial("id").primaryKey(),
    number: text("number").notNull(),
    name: text("name").notNull(),
    type: bankTypeEnum("bank_type").notNull().default("savings"),
    balance: real("balance").notNull().default(0),
    isDefaultAcct: boolean("is_default_acct").default(false),
    asOfDate: text("as_of_date"),
    bankId: integer("bank_id")
      .references(() => banks.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    //Investment account fields
    currValue: real("curr_value").notNull().default(0),
    invType: invTypeEnum("inv_type"),
    isSIP: boolean("is_sip").default(false),

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
