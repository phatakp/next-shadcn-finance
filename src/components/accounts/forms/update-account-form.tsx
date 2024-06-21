"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useModalContext } from "@/components/ui/modal-form";
import { useToast } from "@/components/ui/use-toast";
import {
  deleteAccount,
  updateAccount,
} from "@/lib/db/mutations/accounts.mutations";
import { UpdateAccountSchema } from "@/lib/drizzle/zod-schemas";
import {
  TAction,
  TFullAccount,
  TInvestmentType,
  TUpdateAccountParams,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InvestmentFormWrapper } from "./investment-form-wrapper";
import { NonInvestmentForm } from "./non-investment-form";

type Props = {
  account: TFullAccount;
};

export function UpdateAccountForm({ account }: Props) {
  const [action, setAction] = useState<Omit<TAction, "add">>("update");
  const { toast } = useToast();
  const { closeModal } = useModalContext();

  const form = useForm<TUpdateAccountParams>({
    resolver: zodResolver(UpdateAccountSchema),
    mode: "onChange",
    defaultValues: {
      id: account.id,
      number: account.number,
      name: account.name ?? undefined,
      balance: account.balance,
      currValue: account.currValue,
      isDefaultAcct: account.isDefaultAcct,
      units: account.units ?? 0,
      nav: 0,
      currPrice: 0,
      buyPrice: account.buyPrice ?? 0,
      moneyControlPrefix: account.moneyControlPrefix ?? undefined,
      quantity: account.quantity ?? 0,
      asOfDate: account.asOfDate,
      type: account.type,
      invType: (account.invType as TInvestmentType) ?? undefined,
      isSIP: account.isSIP,
      bankId: account.bankId,
      bankSelect: { label: account.bank.name, value: account.bankId },
    },
  });

  // useEffect(() => {
  //   form.trigger();
  //   // if (form.watch("name") === "") form.setError("name", { type: "required" });
  //   // else form.clearErrors("name");
  // }, [form]);

  console.log(form.formState.errors);
  console.log(form.getValues());

  async function onSubmit(values: TUpdateAccountParams) {
    const { success } = UpdateAccountSchema.safeParse(values);
    if (!success) {
      toast({
        title: "Error",
        description: "Invalid parameters",
        variant: "destructive",
      });
      return;
    }
    const resp =
      action === "update"
        ? await updateAccount(values)
        : await deleteAccount(account.id);
    toast({
      title: resp.success ? "Success" : "Error",
      description: resp.message,
      variant: resp.success ? "default" : "destructive",
    });
    if (resp.success) closeModal();

    closeModal();
  }

  return (
    <Form {...form}>
      <form className="w-full space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        {action === "delete" ? (
          <div className="flex items-center justify-center h-full w-full text-lg font-semibold">
            Do you really want to delete this account?
          </div>
        ) : account.type !== "investment" ? (
          <NonInvestmentForm isUpdate />
        ) : (
          <InvestmentFormWrapper isUpdate />
        )}

        <div className="flex items-center justify-end gap-4">
          {action === "update" && account.bank.name !== "Cash" && (
            <Button
              type="button"
              variant={"destructive"}
              onClick={() => setAction("delete")}
            >
              Delete
            </Button>
          )}
          <Button type="submit">
            {action === "update" ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
