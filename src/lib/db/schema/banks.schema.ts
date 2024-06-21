import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { accountTypes } from "./enums.schema";

export const banks = sqliteTable(
  "banks",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    type: text("type")
      .references(() => accountTypes.type, { onDelete: "cascade" })
      .notNull(),
  },
  (banks) => {
    return {
      bankIndex: uniqueIndex("bank_idx").on(banks.name, banks.type),
    };
  }
);
