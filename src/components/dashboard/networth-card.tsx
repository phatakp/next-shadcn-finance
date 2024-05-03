import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAccountTypeTotals } from "@/lib/db/queries/accounts.queries";
import { amountFormatter } from "@/lib/utils";

export async function NetworthCard() {
  const { networth } = await getAccountTypeTotals();
  return (
    <Card className="sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>Your Networth</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          This is your current value after deducting all liabilities.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-4xl font-extrabold">
        {amountFormatter.format(networth)}
      </CardContent>
    </Card>
  );
}
