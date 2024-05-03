"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TInvestmentType, TNewAccountParams } from "@/types";
import { useFormContext } from "react-hook-form";
import { InvestmentForm } from "./investment-form";

type Props = {
  isUpdate?: boolean;
};

export function InvestmentFormWrapper({ isUpdate = false }: Props) {
  const { watch, setValue } = useFormContext<TNewAccountParams>();
  const form = watch();

  const options = [
    { label: "Equity", value: "equity" },
    { label: "Mutual Fund", value: "fund" },
    { label: "Deposit", value: "fd" },
  ];

  return (
    <Tabs defaultValue={form.invType} className="w-full">
      <TabsList>
        {options.map((o) => (
          <TabsTrigger key={o.value} value={o.value} disabled={isUpdate}>
            {o.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {options.map((o) => (
        <TabsContent key={o.value} value={o.value} className="space-y-8">
          <InvestmentForm
            value={o.value as TInvestmentType}
            isUpdate={isUpdate}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
