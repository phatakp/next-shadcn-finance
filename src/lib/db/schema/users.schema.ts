import { sql } from "drizzle-orm";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email").notNull(),
    image: text("image"),
    createdAt: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (users) => {
    return {
      emailIndex: uniqueIndex("email_idx").on(users.email),
    };
  }
);
