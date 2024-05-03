import { getCategories } from "@/lib/db/queries/categories.queries";
import { TCategoryParent } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useCategories(parent?: TCategoryParent) {
  return useQuery({
    queryKey: ["categories", parent],
    queryFn: () => getCategories(parent),
  });
}
