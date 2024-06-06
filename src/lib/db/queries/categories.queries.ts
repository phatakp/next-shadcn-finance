"use server";

import { categories } from "@/lib/db/schema/categories.schema";
import { db } from "@/lib/drizzle";
import { TCategoryId, TCategoryParent, TransactionType } from "@/types";
import { eq } from "drizzle-orm";

export const getCategories = async (type: TransactionType) => {
  const result = await db.select().from(categories);
  if (type === "expense")
    return result.filter((cat) => !["income", "transfer"].includes(cat.parent));
  return result.filter((cat) => cat.parent === type);
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
