"use client";
import { Button } from "@/components/ui/button";
import { constants } from "@/lib/config/constants";
import { TAccountType } from "@/types";
import { useFormContext } from "react-hook-form";
import { useAccountFormContext } from "../acct-form-context";
import { AcctTypeIcon } from "./acct-type-icon";

export function AccountTypeSelectForm() {
  const { handleAcctTypeChange } = useAccountFormContext();
  const { getValues } = useFormContext();
  const type = getValues("type");

  return (
    <div className="grid gap-4 text-center">
      <div className="flex flex-col gap-4">
        {constants.acctTypes.map((item: TAccountType) => (
          <Button
            variant={type === item ? "destructive" : "outline"}
            key={item}
            type="button"
            className="capitalize w-full"
            size="lg"
            onClick={() => handleAcctTypeChange(item)}
          >
            {item}
            <AcctTypeIcon type={item} />
          </Button>
        ))}
      </div>
    </div>
  );
}
