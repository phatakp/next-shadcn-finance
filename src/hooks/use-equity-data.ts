import { getStockData } from "@/lib/stock";
import { TAccountType, TEquityData, TInvestmentType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useEquityData(
  symbol: string,
  prefix: string | undefined,
  acctType: TAccountType | undefined,
  investment: TInvestmentType | undefined
) {
  return useQuery({
    queryKey: ["equity", symbol, prefix],
    queryFn: async () => {
      const data = await getStockData(prefix, symbol);
      return data as TEquityData | undefined;
    },
    enabled:
      acctType === "investment" &&
      investment === "equity" &&
      !!prefix &&
      symbol.length > 1,
  });
}
