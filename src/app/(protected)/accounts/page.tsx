import { Activity, CreditCard, Users } from "lucide-react";

import { AccountListCard } from "@/components/accounts/cards/account-list-card";
import { AcctTypeCard } from "@/components/accounts/cards/acct-type-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { constants } from "@/lib/config/constants";
import {
  getAccountTypeTotals,
  getAccountsByType,
  getInvestmentTypeTotals,
} from "@/lib/db/queries/accounts.queries";

export default async function Accounts() {
  const { totals } = await getAccountTypeTotals();

  return (
    <Tabs defaultValue={constants.acctTypes[0]} className="w-full py-4">
      <TabsList className="flex flex-col gap-2 w-full h-full md:inline-flex md:flex-row md:w-fit md:items-center md:justify-center md:h-9">
        {constants.acctTypes.map((type) => (
          <TabsTrigger key={type} value={type} className="capitalize w-full">
            {type}
          </TabsTrigger>
        ))}
      </TabsList>
      {constants.acctTypes.map(async (type) => {
        const total = totals.find((t) => t.type === type);
        const accounts = await getAccountsByType(type);
        const { equity, fund, fd } = await getInvestmentTypeTotals();
        return (
          <TabsContent key={type} value={type} className="w-full">
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 md:pl-0">
              <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
                <AcctTypeCard
                  title={type}
                  balance={total?.totalBalance ?? 0}
                  value={total?.totalValue ?? 0}
                  isAsset={total?.isAsset}
                />
                {type === "investment" && (
                  <>
                    <AcctTypeCard
                      title={"Equity"}
                      balance={equity?.totalBalance ?? 0}
                      value={equity?.totalValue ?? 0}
                      isAsset
                    />
                    <AcctTypeCard
                      title={"Mutual Fund"}
                      balance={fund?.totalBalance ?? 0}
                      value={fund?.totalValue ?? 0}
                      isAsset
                    />
                    <AcctTypeCard
                      title={"Deposit"}
                      balance={fd?.totalBalance ?? 0}
                      value={fd?.totalValue ?? 0}
                      isAsset
                    />
                  </>
                )}

                {type !== "investment" && (
                  <>
                    <Card x-chunk="dashboard-01-chunk-1">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Subscriptions
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                          +180.1% from last month
                        </p>
                      </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-2">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Sales
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                          +19% from last month
                        </p>
                      </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-3">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Active Now
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                          +201 since last hour
                        </p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
              <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <AccountListCard type={type} accounts={accounts} />
                <Card x-chunk="dashboard-01-chunk-5">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-8">
                    <div className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          Olivia Martin
                        </p>
                        <p className="text-sm text-muted-foreground">
                          olivia.martin@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$1,999.00</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/02.png" alt="Avatar" />
                        <AvatarFallback>JL</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          Jackson Lee
                        </p>
                        <p className="text-sm text-muted-foreground">
                          jackson.lee@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$39.00</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/03.png" alt="Avatar" />
                        <AvatarFallback>IN</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          Isabella Nguyen
                        </p>
                        <p className="text-sm text-muted-foreground">
                          isabella.nguyen@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$299.00</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/04.png" alt="Avatar" />
                        <AvatarFallback>WK</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          William Kim
                        </p>
                        <p className="text-sm text-muted-foreground">
                          will@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$99.00</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/05.png" alt="Avatar" />
                        <AvatarFallback>SD</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          Sofia Davis
                        </p>
                        <p className="text-sm text-muted-foreground">
                          sofia.davis@email.com
                        </p>
                      </div>
                      <div className="ml-auto font-medium">+$39.00</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
