import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email").notNull(),
    image: text("image"),

    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`now()`),
  },
  (users) => {
    return {
      emailIndex: uniqueIndex("email_idx").on(users.email),
    };
  }
);
