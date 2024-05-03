import { getTxnTypeAccounts } from "@/lib/db/queries/accounts.queries";
import { TransactionType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useAccounts(
  type: TransactionType,
  sourceId?: number,
  isDestination?: boolean
) {
  return useQuery({
    queryKey: ["userAccounts", type, sourceId, isDestination],
    queryFn: () => getTxnTypeAccounts(type, sourceId, isDestination),
    enabled: !!type,
  });
}
