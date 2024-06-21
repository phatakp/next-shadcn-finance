import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { parentCategories } from "./enums.schema";

export const categories = sqliteTable(
  "categories",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    parent: text("type")
      .references(() => parentCategories.parent, { onDelete: "cascade" })
      .notNull()
      .default("miscellaneous"),
  },
  (categories) => {
    return {
      categoryIndex: uniqueIndex("category_idx").on(
        categories.name,
        categories.parent
      ),
    };
  }
);
