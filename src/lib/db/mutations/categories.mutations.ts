"use server";

import { categories } from "@/lib/db/schema/categories.schema";
import { db } from "@/lib/drizzle";
import {
  NewCategoryParams,
  UpdateCategoryParams,
} from "@/lib/drizzle/zod-schemas";
import { handleError } from "@/lib/utils";
import {
  TActionResp,
  TCategoryId,
  TNewCategoryParams,
  TUpdateCategoryParams,
} from "@/types";
import { eq } from "drizzle-orm";

export const createCategory = async (
  category: TNewCategoryParams
): Promise<TActionResp> => {
  const { parentSelect, ...newCategory } = NewCategoryParams.parse(category);
  try {
    const [category] = await db
      .insert(categories)
      .values(newCategory)
      .returning();
    return {
      success: true,
      message: `Category '${category.parent}-${category.name}' created successfully`,
    };
  } catch (err) {
    return handleError(err);
  }
};

export const updateCategory = async (
  category: TUpdateCategoryParams
): Promise<TActionResp> => {
  const { id, ...newCategory } = UpdateCategoryParams.parse(category);
  try {
    const [category] = await db
      .update(categories)
      .set(newCategory)
      .where(eq(categories.id, id))
      .returning();
    return {
      success: true,
      message: `Category '${category.parent}-${category.name}' updated successfully`,
    };
  } catch (err) {
    return handleError(err);
  }
};

export const deleteCategory = async (id: TCategoryId): Promise<TActionResp> => {
  try {
    const [category] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return {
      success: true,
      message: `Category '${category.parent}-${category.name}' deleted successfully`,
    };
  } catch (err) {
    return handleError(err);
  }
};
