import { constants } from "@/lib/config/constants";
import { createEnumObject } from "@/lib/utils";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const acctTypeObject = createEnumObject(constants.acctTypes);
export const accountTypes = sqliteTable("accountTypes", {
  type: text("type").primaryKey(),
});

export const invTypeObject = createEnumObject(constants.invTypes);
export const invTypes = sqliteTable("invTypes", {
  type: text("type").primaryKey(),
});

export const txnTypeObject = createEnumObject(constants.txnTypes);
export const txnTypes = sqliteTable("txnTypes", {
  type: text("type").primaryKey(),
});

export const parentCategoryObject = createEnumObject(
  constants.parentCategories
);
export const parentCategories = sqliteTable("parentCategories", {
  parent: text("parent").primaryKey(),
});
export const frequencyObject = createEnumObject(constants.frequency);
export const frequency = sqliteTable("frequency", {
  type: text("type").primaryKey(),
});
