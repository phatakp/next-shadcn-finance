import { getCategories } from "@/lib/db/queries/categories.queries";
import { TransactionType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useCategories(type: TransactionType) {
  return useQuery({
    queryKey: ["categories", type],
    queryFn: () => getCategories(type),
    enabled: !!type,
  });
}
