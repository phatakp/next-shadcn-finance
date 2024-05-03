"use client";
import { FormLabel } from "@/components/ui/form";
import { amountFormatter, cn } from "@/lib/utils";
import { TNewAccountParams } from "@/types";
import { useFormContext } from "react-hook-form";

export function ReviewFormData() {
  const { watch } = useFormContext<TNewAccountParams>();
  const form = watch();

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 grid-flow-dense gap-x-4 gap-y-8 justify-center">
        <div className="grid w-full gap-2">
          <FormLabel className="text-muted-foreground">Type</FormLabel>
          <FormLabel className="capitalize">{form.type}</FormLabel>
        </div>
        <div className="grid w-full gap-2">
          <FormLabel className="text-muted-foreground">
            {form.type === "investment" ? "Broker" : "Bank"}
          </FormLabel>
          <FormLabel>{form.bankSelect?.label}</FormLabel>
        </div>
        <div className="grid w-full gap-2">
          <FormLabel className="text-muted-foreground">Acct Number</FormLabel>
          <FormLabel>{form.number}</FormLabel>
        </div>

        <div
          className={cn(
            "grid w-full gap-2",
            form.type === "investment" &&
              form.invType !== "fd" &&
              "col-span-2 md:col-span-3"
          )}
        >
          <FormLabel className="text-muted-foreground">Acct Name</FormLabel>
          <FormLabel className="capitalize truncate">{form.name}</FormLabel>
        </div>

        {form.type === "investment" && form.invType !== "fd" && (
          <div className="grid w-full gap-2">
            <FormLabel className="text-muted-foreground">
              {form.invType === "fund" ? "Units" : "Quantity"}
            </FormLabel>
            <FormLabel className="">
              {form.invType === "fund" ? form.units : form.quantity} @{" "}
              {form.invType === "fund" ? form.nav : form.buyPrice}
            </FormLabel>
          </div>
        )}

        {form.type === "investment" && (
          <div className="grid w-full gap-2">
            <FormLabel className="text-muted-foreground">Invested</FormLabel>
            <FormLabel className="">
              {amountFormatter.format(form.balance ?? 0)}
            </FormLabel>
          </div>
        )}

        <div className="grid w-full gap-2">
          <FormLabel className="text-muted-foreground">
            {form.type === "investment" ? "Curr Value" : "Balance"}
          </FormLabel>
          <FormLabel className="">
            {amountFormatter.format(form.currValue ?? 0)}
          </FormLabel>
        </div>

        {["savings", "credit-card"].includes(form.type) && (
          <div className="grid w-full gap-2">
            <FormLabel className="text-muted-foreground">
              Default Account
            </FormLabel>
            <FormLabel className="">
              {form.isDefaultAcct ? "Yes" : "No"}
            </FormLabel>
          </div>
        )}
      </div>
    </>
  );
}
