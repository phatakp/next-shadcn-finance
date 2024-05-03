"use client";

import AccountFormProvider, {
  useAccountFormContext,
} from "@/components/accounts/acct-form-context";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useModalContext } from "@/components/ui/modal-form";
import { useToast } from "@/components/ui/use-toast";
import { createAccount } from "@/lib/db/mutations/accounts.mutations";
import { NewAccountParams } from "@/lib/drizzle/zod-schemas";
import { cn } from "@/lib/utils";
import { TAccountType, TNewAccountParams } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { AccountTypeSelectForm } from "./acct-type-select-form";
import { InvestmentFormWrapper } from "./investment-form-wrapper";
import { NonInvestmentForm } from "./non-investment-form";
import { ReviewFormData } from "./review-form-data";

type Props = {
  type?: TAccountType;
};

export function AddAccountForm({ type }: Props) {
  const [step, setStep] = useState(type ? 2 : 1);
  const { toast } = useToast();
  const { closeModal } = useModalContext();

  const form = useForm<TNewAccountParams>({
    resolver: zodResolver(NewAccountParams),
    mode: "onChange",
    defaultValues: {
      type,
      isDefaultAcct: false,
      asOfDate: format(new Date(), "MM/dd/yyyy"),
      invType: undefined,
      isSIP: false,
      bankId: 0,
      bankSelect: undefined,
    },
  });

  const formData = form.watch();

  async function onSubmit(values: TNewAccountParams) {
    const { success } = NewAccountParams.safeParse(values);
    if (!success) {
      toast({
        title: "Error",
        description: "Invalid parameters",
        variant: "destructive",
      });
      return;
    }
    const resp = await createAccount(values);
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
      <AccountFormProvider step={step} setStep={setStep} type={type}>
        <form
          className="w-full space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormSteps />

          {step === 1 && <AccountTypeSelectForm />}

          {step === 2 && formData.type !== "investment" && (
            <NonInvestmentForm />
          )}

          {step === 2 && formData.type === "investment" && (
            <InvestmentFormWrapper />
          )}

          {step === 3 && <ReviewFormData />}

          {step > 1 && (
            <div className="flex items-center w-full justify-between">
              <PrevButton />
              {step === 3 ? (
                <Button type="submit">Submit</Button>
              ) : (
                <NextButton />
              )}
            </div>
          )}
        </form>
      </AccountFormProvider>
    </Form>
  );
}

function FormSteps() {
  const { step } = useAccountFormContext();
  return (
    <div className="grid items-center md:grid-cols-3 gap-4 text-sm overflow-clip">
      <div className={cn(step > 1 ? "hidden md:grid" : "grid")}>
        <span className="rounded-lg w-full h-2 bg-primary"></span>
        <span className="text-primary">Select Acct Type</span>
      </div>

      <div className={cn(step !== 2 ? "hidden md:grid" : "grid")}>
        <span
          className={cn(
            "rounded-lg w-full h-2",
            step >= 2 ? "bg-primary" : "bg-muted-foreground"
          )}
        ></span>
        <span
          className={cn(step >= 2 ? "text-primary" : "text-muted-foreground")}
        >
          Enter details
        </span>
      </div>

      <div className={cn(step !== 3 ? "hidden md:grid" : "grid")}>
        <span
          className={cn(
            "rounded-lg w-full h-2",
            step > 2 ? "bg-primary" : "bg-muted-foreground"
          )}
        ></span>
        <span
          className={cn(step > 2 ? "text-primary" : "text-muted-foreground")}
        >
          Review details
        </span>
      </div>
    </div>
  );
}

function PrevButton() {
  const { setStep } = useAccountFormContext();
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => setStep((prev) => prev - 1)}
    >
      <ArrowLeft className="size-4 mr-2" />
      Back
    </Button>
  );
}

function NextButton() {
  const { setStep } = useAccountFormContext();
  const { trigger } = useFormContext<TNewAccountParams>();

  async function handleNextClick() {
    const valid = await trigger();
    if (valid) setStep((prev) => prev + 1);
  }

  return (
    <Button type="button" onClick={handleNextClick}>
      Next
      <ArrowRight className="size-4 ml-2" />
    </Button>
  );
}
