"use server";

import { users } from "@/lib/db/schema/users.schema";
import { db } from "@/lib/drizzle";
import { NewUserSchema, UpdateUserSchema } from "@/lib/drizzle/zod-schemas";
import { handleError } from "@/lib/utils";
import {
  TActionResp,
  TNewUserParams,
  TUpdateUserParams,
  TUserId,
} from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const revalidateUsers = () => revalidatePath("/", "layout");

export const createUser = async (
  user: TNewUserParams
): Promise<TActionResp> => {
  const newUserData = NewUserSchema.parse(user);
  try {
    const [newUser] = await db.insert(users).values(newUserData).returning();
    revalidateUsers();
    return {
      success: true,
      message: `User '${newUser.firstName} ${newUser.lastName}' created successfully`,
    };
  } catch (err) {
    return handleError(err);
  }
};

export const updateUser = async (
  user: TUpdateUserParams
): Promise<TActionResp> => {
  const { id, ...userdata } = UpdateUserSchema.parse(user);
  try {
    const [updUser] = await db
      .update(users)
      .set(userdata)
      .where(eq(users.id, id))
      .returning();
    revalidateUsers();
    return {
      success: true,
      message: `User '${updUser.firstName} ${updUser.lastName}' updated successfully`,
    };
  } catch (err) {
    return handleError(err);
  }
};

export const deleteUser = async (id: TUserId) => {
  try {
    const [user] = await db.delete(users).where(eq(users.id, id)).returning();
    revalidateUsers();
    return {
      success: true,
      message: `User '${user.firstName} ${user.lastName}' deleted successfully`,
    };
  } catch (err) {
    return handleError(err);
  }
};
