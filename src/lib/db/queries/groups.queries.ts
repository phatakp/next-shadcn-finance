"use server";

import { groupUsers, groups } from "@/lib/db/schema/groups.schema";
import { db } from "@/lib/drizzle";
import { getUser } from "@workos-inc/authkit-nextjs";
import { eq } from "drizzle-orm";

export const getGroups = async () => {
  const { user } = await getUser({ ensureSignedIn: true });
  const result = await db
    .select({ group: groups, users: groupUsers })
    .from(groups)
    .innerJoin(groupUsers, eq(groupUsers.groupId, groups.id))
    .where(eq(groupUsers.userId, user.id));
  return result.map((r) => ({ ...r.group }));
};
