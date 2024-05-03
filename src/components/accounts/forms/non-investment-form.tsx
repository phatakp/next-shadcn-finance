"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormSwitch } from "@/components/ui/form-switch";
import { TNewAccountParams } from "@/types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useAccountFormContext } from "../acct-form-context";

type Props = {
  isUpdate?: boolean;
};

export function NonInvestmentForm({ isUpdate = false }: Props) {
  const { handleBankChange, handleBankCreate, isBankLoading, bankOptions } =
    useAccountFormContext();
  const { watch, setValue } = useFormContext<TNewAccountParams>();
  const form = watch();

  useEffect(() => {
    if (form.type !== "investment") setValue("currValue", form.balance);
  }, [form.balance, form.type, setValue]);

  return (
    <>
      <FormSelect
        name="bankSelect"
        label="Bank"
        options={bankOptions}
        isLoading={isBankLoading}
        onCreateOption={handleBankCreate}
        onChange={handleBankChange}
        isSearchable
        noOptionsMessage={() => "No Banks Found"}
        isDisabled={isUpdate}
        value={form.bankSelect}
      />

      <FormInput
        name="number"
        label="Acct Number"
        className="capitalize"
        disabled={isUpdate}
        value={form.number}
      />

      <FormInput name="name" label="Acct Name" value={form.name} />

      <FormInput
        name="balance"
        label={
          form.type === "credit-card" ? "Card Outstanding" : "Acct Balance"
        }
        type="number"
        value={form.balance}
      />

      {["savings", "credit-card"].includes(form.type) && (
        <FormSwitch
          name="isDefaultAcct"
          label="Default Account"
          desc="To be used for all transactions"
          value={!!form.isDefaultAcct}
        />
      )}
    </>
  );
}
