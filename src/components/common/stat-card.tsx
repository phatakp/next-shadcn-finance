import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAccountTypeTotals } from "@/lib/db/queries/accounts.queries";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { AmountField } from "./amount-field";

type Props = {
  isAsset?: boolean;
};

export async function StatCard({ isAsset = false }: Props) {
  const { networth, assets, liabilities, assetInvested } =
    await getAccountTypeTotals();
  let change = 0;
  if (isAsset && assetInvested > 0)
    change = ((assets - assetInvested) / assetInvested) * 100;
  else if (isAsset && assetInvested === 0) return;
  else if (!isAsset && liabilities === 0) return;
  else if (!isAsset && networth > 0) change = (liabilities / networth) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{isAsset ? "Assets" : "Liabilities"}</CardDescription>
        <CardTitle>
          <AmountField
            amount={isAsset ? assets : liabilities}
            className={cn(
              "text-4xl",
              isAsset ? "text-success" : "text-destructive"
            )}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {isAsset && change > 0 ? "+" : ""}
          {change.toFixed(1)}%{" "}
          {isAsset
            ? `${change > 0 ? "increase" : "decrease"} in value`
            : "of your networth"}
        </div>
      </CardContent>
      <CardFooter>
        <Progress value={change} aria-label={`${change.toFixed()}`} />
      </CardFooter>
    </Card>
  );
}
