import { getBanks } from "@/lib/db/queries/banks.queries";
import { TBankType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useBanks(type?: TBankType) {
  return useQuery({ queryKey: ["banks", type], queryFn: () => getBanks(type) });
}
