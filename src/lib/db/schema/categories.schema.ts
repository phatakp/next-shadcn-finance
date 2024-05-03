import { pgTable, serial, text, uniqueIndex } from "drizzle-orm/pg-core";

import { parentCategoryEnum } from "./enums.schema";

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    parent: parentCategoryEnum("parent_category")
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
