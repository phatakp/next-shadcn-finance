"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useModalContext } from "@/components/ui/modal-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { constants } from "@/lib/config/constants";
import { createTransaction } from "@/lib/db/mutations/transactions.mutations";
import { NewTxnParams } from "@/lib/drizzle/zod-schemas";
import { capitalize } from "@/lib/utils";
import { TNewTxnParams, TransactionType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TxnFormProvider from "../txn-form-context";
import { TransactionForm } from "./transaction-form";

export function AddTxnForm() {
  const { closeModal } = useModalContext();
  const { toast } = useToast();

  const form = useForm<TNewTxnParams>({
    resolver: zodResolver(NewTxnParams),
    mode: "onChange",
    defaultValues: {
      type: "expense",
      date: new Date(),
      isRecurring: false,
    },
  });

  const formData = form.watch();
  console.log(form.formState.errors);

  async function onSubmit(values: TNewTxnParams) {
    const { success } = NewTxnParams.safeParse(values);
    if (!success) {
      toast({
        title: "Error",
        description: "Invalid parameters",
        variant: "destructive",
      });
      return;
    }
    const resp = await createTransaction(values);
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
      <TxnFormProvider>
        <form
          className="w-full space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Tabs defaultValue={formData.type} className="w-full">
            <TabsList>
              {constants.txnTypes.map((o) => (
                <TabsTrigger key={o} value={o}>
                  {capitalize(o)}
                </TabsTrigger>
              ))}
            </TabsList>
            {constants.txnTypes.map((o) => (
              <TabsContent key={o} value={o} className="space-y-8">
                <TransactionForm value={o as TransactionType} />
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex items-center w-full justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </TxnFormProvider>
    </Form>
  );
}
