import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { users } from "./users.schema";

export const groups = sqliteTable("groups", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("text").notNull(),
});

export const groupUsers = sqliteTable(
  "group_users",
  {
    groupId: integer("group_id")
      .references(() => groups.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
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
