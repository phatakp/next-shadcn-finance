import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("text").notNull(),
});

export const groupUsers = pgTable(
  "group_users",
  {
    groupId: integer("group_id")
      .references(() => groups.id, {
        onDelete: "cascade",
      })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (groupUsers) => {
    return {
      id: primaryKey({
        name: "id",
        columns: [groupUsers.groupId, groupUsers.userId],
      }),
    };
  }
);
