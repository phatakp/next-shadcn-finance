import { TAccountType, TInvestmentType, TMFAPIData } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useFundData(
  code: string,
  acctType: TAccountType | undefined,
  investment: TInvestmentType | undefined
) {
  return useQuery({
    queryKey: ["fund", code],
    queryFn: async () => {
      const resp = await fetch(`/api/mf-details?code=${code}`);
      const { data }: { data: TMFAPIData } = await resp.json();
      return data;
    },
    enabled:
      acctType === "investment" &&
      investment === "fund" &&
      !!code &&
      code.length > 5,
  });
}
