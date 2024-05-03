import { cn, shortAmount } from "@/lib/utils";
import { IndianRupee } from "lucide-react";

type Props = {
  amount: number;
  className?: string;
};

export function AmountField({ amount, className }: Props) {
  return (
    <div className={cn("flex items-center text-2xl", className)}>
      <IndianRupee className="size-4" />
      <span className="font-bold">{shortAmount(amount)}</span>
    </div>
  );
}
