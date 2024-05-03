import { pgTable, serial, text, uniqueIndex } from "drizzle-orm/pg-core";
import { bankTypeEnum } from "./enums.schema";

export const banks = pgTable(
  "banks",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    type: bankTypeEnum("bank_type").notNull().default("savings"),
  },
  (banks) => {
    return {
      bankIndex: uniqueIndex("bank_idx").on(banks.name, banks.type),
    };
  }
);
