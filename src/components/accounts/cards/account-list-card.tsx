import { AddAccountBtn } from "@/components/accounts/add-account-btn";
import PaginationWrapper from "@/components/common/pagination-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAccountsByType } from "@/lib/db/queries/accounts.queries";
import { TAccountType } from "@/types";
import { AccountList } from "../account-list";

type Props = {
  type: TAccountType;
};

export async function AccountListCard({ type }: Props) {
  const accounts = await getAccountsByType(type);
  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle className="capitalize">{type} Accounts</CardTitle>
          <CardDescription>
            You have {accounts.length} account{accounts.length > 1 ? "s" : ""}
          </CardDescription>
        </div>
        {accounts.length > 0 && (
          <div className="ml-auto gap-1">
            <AddAccountBtn type={type} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <EmptyAccounts type={type} />
        ) : (
          <PaginationWrapper dataLength={accounts.length}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Acct Number</TableHead>
                  <TableHead className="">
                    {type === "investment" ? "Broker" : "Bank"}
                  </TableHead>
                  {type === "investment" && (
                    <>
                      <TableHead className="hidden md:table-column">
                        As Of
                      </TableHead>
                      <TableHead className="hidden md:table-column md:text-right">
                        Invested
                      </TableHead>
                    </>
                  )}
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <AccountList accounts={accounts} />
            </Table>
          </PaginationWrapper>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyAccounts({ type }: { type: TAccountType }) {
  return (
    <main className="p-4 lg:gap-6 lg:p-6 h-full">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            No {type} accounts
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            You can start monitoring as soon as you add an account.
          </p>
          <AddAccountBtn type={type} />
        </div>
      </div>
    </main>
  );
}
