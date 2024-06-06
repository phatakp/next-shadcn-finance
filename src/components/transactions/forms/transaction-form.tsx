"use client";

import { FormLabel } from "@/components/ui/form";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormSwitch } from "@/components/ui/form-switch";
import { constants } from "@/lib/config/constants";
import { capitalize, cn } from "@/lib/utils";
import { TNewTxnParams, TransactionType } from "@/types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTxnFormContext } from "../txn-form-context";

const freqOptions = constants.frequency.map((f) => ({
  label: capitalize(f),
  value: f,
}));

type Props = {
  value: TransactionType;
  isUpdate?: boolean;
};

export function TransactionForm({ value, isUpdate = false }: Props) {
  const { watch, setValue } = useFormContext<TNewTxnParams>();
  const {
    isCatLoading,
    categoryOptions,
    handleCategoryChange,
    isGroupLoading,
    groupOptions,
    handleGroupChange,
    isSourceLoading,
    srcOptions,
    isDestLoading,
    destOptions,
    handleSourceChange,
    handleDestinationChange,
    handleFrequencyChange,
  } = useTxnFormContext();
  const form = watch();

  useEffect(() => {
    setValue("type", value);
  }, [setValue, value]);

  return (
    <>
      <FormInput
        name="description"
        label="Description"
        placeholder="Remarks for your transaction"
        value={form.description ?? ""}
      />

      <div className="flex gap-4">
        <FormInput name="amount" label="Amount" value={form.amount} />
        <FormDatePicker name="date" label="Date" />
      </div>

      <div className="flex gap-4">
        {form.type !== "income" && (
          <div className="grid w-full">
            <FormSelect
              name="sourceSelect"
              label="Source"
              options={srcOptions}
              isLoading={isSourceLoading}
              onChange={handleSourceChange}
              isSearchable
              isClearable
              noOptionsMessage={() => "No Accounts Found"}
              isDisabled={isUpdate}
              value={form.sourceSelect}
            />
            <FormLabel
              className={cn(
                "text-xs text-muted-foreground truncate -mt-1.5",
                !form.sourceId && !isSourceLoading ? "opacity-0" : "opacity-100"
              )}
            >
              <div className="inline-flex items-center gap-1">
                <span>Balance:</span>
                <span>{form.srcBalance}</span>
              </div>
            </FormLabel>
          </div>
        )}
        {form.type !== "expense" && (
          <div className="grid w-full">
            <FormSelect
              name="destinationSelect"
              label="Destination"
              options={destOptions}
              isLoading={isDestLoading}
              onChange={handleDestinationChange}
              isSearchable
              isClearable
              noOptionsMessage={() => "No Accounts Found"}
              isDisabled={isUpdate}
              value={form.destinationSelect}
            />
            <FormLabel
              className={cn(
                "text-xs text-muted-foreground truncate -mt-1.5",
                !form.destinationId && !isDestLoading
                  ? "opacity-0"
                  : "opacity-100"
              )}
            >
              <div className="inline-flex items-center gap-1">
                <span>Balance:</span>
                <span>{form.destBalance}</span>
              </div>
            </FormLabel>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <FormSelect
          name="categorySelect"
          label="Category"
          options={categoryOptions}
          isLoading={isCatLoading}
          onChange={handleCategoryChange}
          isSearchable
          isClearable
          noOptionsMessage={() => "No Category Found"}
          isDisabled={isUpdate}
          value={form.categorySelect}
        />
        {!!groupOptions && groupOptions.length > 0 && (
          <FormSelect
            name="groupSelect"
            label="Group"
            options={groupOptions}
            isLoading={isGroupLoading}
            onChange={handleGroupChange}
            isSearchable
            isClearable
            noOptionsMessage={() => "No Group Found"}
            isDisabled={isUpdate}
            value={form.groupSelect}
          />
        )}
      </div>

      {form.type !== "income" && (
        <FormSwitch
          name="isRecurring0"
          label="Repeat"
          desc="Is it a repeating transaction"
          value={!!form.isRecurring}
        />
      )}

      {form.isRecurring && (
        <>
          <FormSelect
            name="frequencySelect"
            label="Frequency"
            options={freqOptions}
            onChange={handleFrequencyChange}
            isDisabled={isUpdate}
            value={form.destinationSelect}
          />

          <div className="flex gap-4">
            <FormDatePicker name="startDate" label="Start Date" />
            <FormDatePicker name="endDate" label="End Date" />
          </div>
        </>
      )}
    </>
  );
}
