"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useModalContext } from "@/components/ui/modal-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { constants } from "@/lib/config/constants";
import { NewTxnParams } from "@/lib/drizzle/zod-schemas";
import { capitalize } from "@/lib/utils";
import { TNewTxnParams, TransactionType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TxnFormProvider from "../txn-form-context";
import { TransactionForm } from "./transaction-form";

export function AddTxnForm() {
  const { closeModal } = useModalContext();

  const form = useForm<TNewTxnParams>({
    resolver: zodResolver(NewTxnParams),
    mode: "onChange",
    defaultValues: {
      type: "expense",
      date: new Date(),
      isRecurring: false,
      categoryId: 0,
      categorySelect: undefined,
      sourceId: 0,
      sourceSelect: undefined,
      destinationId: 0,
      destinationSelect: undefined,
      groupId: 0,
      groupSelect: undefined,
      frequency: undefined,
      frequencySelect: undefined,
      startDate: undefined,
      endDate: undefined,
    },
  });

  const formData = form.watch();

  async function onSubmit(values: TNewTxnParams) {
    console.log(values);
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
