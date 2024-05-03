import { cn } from "@/lib/utils";
import { TAccountType } from "@/types";
import {
  CreditCard,
  HandCoins,
  Landmark,
  PiggyBank,
  WalletMinimal,
} from "lucide-react";

type Props = {
  type: TAccountType;
  className?: string;
};

export function AcctTypeIcon({ type, className }: Props) {
  switch (type) {
    case "investment":
      return (
        <PiggyBank className={cn("size-4 font-extralight ml-2", className)} />
      );
    case "mortgage":
      return (
        <Landmark className={cn("size-4 font-extralight ml-2", className)} />
      );
    case "credit-card":
      return (
        <CreditCard className={cn("size-4 font-extralight ml-2", className)} />
      );
    case "wallet":
      return (
        <WalletMinimal
          className={cn("size-4 font-extralight ml-2", className)}
        />
      );
    default:
      return (
        <HandCoins className={cn("size-4 font-extralight ml-2", className)} />
      );
  }
}
