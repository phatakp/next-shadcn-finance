import { AmountField } from "@/components/common/amount-field";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAccountTypeTotals } from "@/lib/db/queries/accounts.queries";
import { TAccountType } from "@/types";
import { AcctTypeIcon } from "../forms/acct-type-icon";
import { RefreshAcctsBtn } from "../refresh-accts-btn";

type Props = {
  title: string;
  balance: number;
  value: number;
  isAsset?: boolean;
};
export async function AcctTypeCard({
  title,
  balance,
  value,
  isAsset = false,
}: Props) {
  const { assets, liabilities } = await getAccountTypeTotals();

  let change = 0;
  if (isAsset && assets > 0) change = (value / assets) * 100;
  if (!isAsset && liabilities > 0) change = (balance / liabilities) * 100;

  return (
    <Card>
      <CardHeader className="">
        <CardDescription className="text-sm font-medium capitalize flex flex-row items-center justify-between space-y-0">
          Total {title}
          {["savings", "Equity"].includes(title) ? "" : "s"}
          {!["investment", "Equity", "Mutual Fund", "Deposit"].includes(
            title
          ) && (
            <AcctTypeIcon
              type={title as TAccountType}
              className="size-4 text-muted-foreground m-0"
            />
          )}
          {["Equity", "Mutual Fund", "Deposit"].includes(title) && (
            <AcctTypeIcon
              type={"investment"}
              className="size-4 text-muted-foreground m-0"
            />
          )}
          {title === "investment" && <RefreshAcctsBtn />}
        </CardDescription>
        <CardTitle>
          <AmountField amount={value} />
        </CardTitle>
      </CardHeader>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {change.toFixed(1)}% of your {isAsset ? "assets" : "liabilities"}
        </p>
      </CardFooter>
    </Card>
  );
}
