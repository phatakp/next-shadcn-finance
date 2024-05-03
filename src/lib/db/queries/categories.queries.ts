"use server";

import { categories } from "@/lib/db/schema/categories.schema";
import { db } from "@/lib/drizzle";
import { TCategoryId, TCategoryParent } from "@/types";
import { eq } from "drizzle-orm";

export const getCategories = async (parent?: TCategoryParent) => {
  if (parent) return await getCategoriesByParent(parent);
  const result = await db.select().from(categories);
  return result;
};

export const getCategoryById = async (id: TCategoryId) => {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));
  if (!category) return null;

  return category;
};

export const getCategoriesByParent = async (parent: TCategoryParent) => {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.parent, parent));
  return result;
};
