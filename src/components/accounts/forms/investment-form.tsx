"use client";

import { FormLabel } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormSwitch } from "@/components/ui/form-switch";
import { useEquityData } from "@/hooks/use-equity-data";
import { useFundData } from "@/hooks/use-fund-data";
import { amountFormatter, cn, shortAmount } from "@/lib/utils";
import { TInvestmentType, TNewAccountParams } from "@/types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useAccountFormContext } from "../acct-form-context";
import { NonInvestmentForm } from "./non-investment-form";

type Props = {
  value: TInvestmentType;
  isUpdate?: boolean;
};

export function InvestmentForm({ value, isUpdate }: Props) {
  const { watch, setValue } = useFormContext<TNewAccountParams>();
  const form = watch();
  console.log("@@INPUT VALUE", value, form.invType);
  const { handleBankChange, handleBankCreate, isBankLoading, bankOptions } =
    useAccountFormContext();

  // Fetch Fund Data for entered MF scheme code
  const { data: fund, isLoading: isFundLoading } = useFundData(
    form.number,
    form.type,
    form.invType
  );
  const fundName = fund?.meta?.scheme_name ?? "";
  const fundNav = fund?.data?.[0]?.nav ?? "0";

  // Fetch Equity Data for entered symbol
  const { data: equity, isLoading: isEquityLoading } = useEquityData(
    form.number,
    form.moneyControlPrefix ?? undefined,
    form.type,
    form.invType
  );

  useEffect(() => {
    setValue("invType", value);
  }, [setValue, value]);

  useEffect(() => {
    //Fund field calculation
    if (!!fundNav) {
      const nav = parseFloat(fundNav);
      setValue("name", fundName);
      setValue("nav", nav);
      if (form.units) setValue("currValue", nav * form.units);
    }
  }, [form.units, fundName, fundNav, setValue]);

  useEffect(() => {
    //Stock field calculation
    if (!!equity?.price) {
      setValue("name", equity.stockName);
      setValue("currPrice", equity.price);
      if (form.buyPrice && form.quantity) {
        setValue("balance", form.buyPrice * form.quantity);
        setValue("currValue", equity.price * form.quantity);
      }
    }
  }, [
    equity?.price,
    equity?.stockName,
    form.asOfDate,
    form.currPrice,
    form.buyPrice,
    form.quantity,
    setValue,
  ]);

  return (
    <>
      <FormSwitch
        name="isSIP"
        label="SIP"
        desc="Is this investment a monthly SIP"
        disabled={isUpdate}
        value={!!form.isSIP}
      />

      {value !== "fd" && (
        <div className="flex gap-4 w-full">
          <FormSelect
            name="bankSelect"
            label="Broker"
            options={bankOptions}
            isLoading={isBankLoading}
            onCreateOption={handleBankCreate}
            onChange={handleBankChange}
            isSearchable
            isClearable
            noOptionsMessage={() => "No Brokers Found"}
            isDisabled={isUpdate}
            value={form.bankSelect}
          />
          {value === "equity" && (
            <div className="grid w-full">
              <FormInput
                name="number"
                label="Symbol"
                disabled={isUpdate}
                value={form.number}
              />
              <FormLabel
                className={cn(
                  "text-xs text-muted-foreground truncate -mt-1.5",
                  !form.currPrice && !isEquityLoading
                    ? "opacity-0"
                    : "opacity-100"
                )}
              >
                <div className="inline-flex items-center gap-1">
                  <span>Curr Price:</span>
                  <span>{amountFormatter.format(form.currPrice ?? 0)}</span>
                </div>
              </FormLabel>
            </div>
          )}
        </div>
      )}

      {value === "equity" && (
        <>
          <div className="grid w-full">
            <FormInput
              name="moneyControlPrefix"
              label="Money Control Prefix"
              placeholder="category/name"
              disabled={isUpdate}
              value={form.moneyControlPrefix ?? ""}
            />
            <FormLabel
              className={cn(
                "text-xs text-muted-foreground truncate -mt-1.5",
                !equity?.stockName && !isEquityLoading
                  ? "opacity-0"
                  : "opacity-100"
              )}
            >
              <div className="inline-flex items-center gap-1">
                <span>Name:</span>
                <span>{equity?.stockName}</span>
              </div>
            </FormLabel>
          </div>

          <div className="grid w-full">
            <div className="flex gap-4">
              <FormInput
                name="quantity"
                label="Quantity"
                value={form.quantity}
              />

              <FormInput
                name="buyPrice"
                label="Buy Price"
                value={form.buyPrice}
              />
            </div>
            <FormLabel
              className={cn(
                "text-xs text-muted-foreground truncate",
                !form.currPrice && !isEquityLoading
                  ? "opacity-0"
                  : "opacity-100"
              )}
            >
              <div className="inline-flex items-center gap-1">
                {form.balance && (
                  <>
                    <span>Invested:</span>
                    <span>{shortAmount(form.balance)}</span>
                  </>
                )}
                {form.currValue && (
                  <>
                    <span>; Curr Value:</span>
                    <span>{shortAmount(form.currValue)}</span>
                  </>
                )}
              </div>
            </FormLabel>
          </div>
        </>
      )}

      {value === "fund" && (
        <>
          <div className="grid w-full">
            <FormInput
              name="number"
              label="Mutual Fund Code"
              placeholder="Code from MF API"
              disabled={isUpdate}
              value={form.number}
            />

            <FormLabel
              className={cn(
                "text-xs text-muted-foreground truncate -mt-1.5",
                !form.name && !isFundLoading ? "opacity-0" : "opacity-100"
              )}
            >
              <div className="inline-flex items-center gap-1">
                <span>Name:</span>
                <span>{form.name}</span>
              </div>
            </FormLabel>
          </div>

          <div className="flex gap-4">
            <div className="grid w-full">
              <FormInput
                name="units"
                label="Units"
                type="number"
                value={form.units}
              />
              <FormLabel
                className={cn(
                  "text-xs text-muted-foreground -mt-1.5",
                  !fund?.data ? "opacity-0" : "opacity-100"
                )}
              >
                <div className="inline-flex items-center gap-1">
                  <span>NAV:</span>
                  <span>{form.nav}</span>
                  <span>@</span>
                  <span>{fund?.data?.[0]?.date}</span>
                </div>
              </FormLabel>
            </div>

            <div className="grid w-full">
              <FormInput
                name="balance"
                label="Invested Amount"
                type="number"
                value={form.balance}
              />

              <FormLabel
                className={cn(
                  "text-xs text-muted-foreground -mt-1.5",
                  !form.currValue ? "opacity-0" : "opacity-100"
                )}
              >
                <div className="inline-flex items-center gap-1">
                  <span className="hidden sm:flex">Curr</span>
                  <span>Value:</span>
                  <span>{amountFormatter.format(form.currValue ?? 0)}</span>
                </div>
              </FormLabel>
            </div>
          </div>
        </>
      )}

      {value === "fd" && (
        <>
          <>
            <NonInvestmentForm isUpdate={isUpdate} />
            <FormInput
              name="currValue"
              label="Curr Value"
              type="number"
              value={form.currValue}
            />
          </>
        </>
      )}
    </>
  );
}
