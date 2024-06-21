import { getBanks } from "@/lib/db/queries/banks.queries";
import { TAccountType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useBanks(type?: TAccountType) {
  return useQuery({ queryKey: ["banks", type], queryFn: () => getBanks(type) });
}
