import { useBanks } from "@/hooks/use-banks";
import { createBank } from "@/lib/db/mutations/banks.mutations";
import { NewBankSchema } from "@/lib/drizzle/zod-schemas";
import { capitalize } from "@/lib/utils";
import {
  TAccountType,
  TBank,
  TBankOption,
  TBankType,
  TNewAccountParams,
} from "@/types";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useFormContext } from "react-hook-form";
import { useToast } from "../ui/use-toast";

type AccountFormValue = {
  type?: TAccountType;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
};

const AccountFormContext = createContext({} as AccountFormValue);

export default function AccountFormProvider({
  step,
  setStep,
  type,
  children,
}: {
  type?: TAccountType;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  children: ReactNode;
}) {
  return (
    <AccountFormContext.Provider value={{ type, step, setStep }}>
      {children}
    </AccountFormContext.Provider>
  );
}

export function useAccountFormContext() {
  const context = useContext(AccountFormContext);
  if (!context)
    throw new Error("Account Form context should be inside a provider");

  const { watch, setValue, setError, clearErrors } =
    useFormContext<TNewAccountParams>();
  const { type, step, setStep } = context;
  const { toast } = useToast();
  const formData = watch();

  useEffect(() => {
    if (formData.bankId === 0)
      setError("bankSelect", { message: "Required", type: "required" });
    else clearErrors("bankSelect");
  }, [formData.bankId, setError, clearErrors]);

  useEffect(() => {
    if (!!type && !formData.type) setValue("type", type);
    if (formData.type === "investment") setValue("invType", "equity");
  }, [formData.type, setValue, type]);

  const { data: banks, isLoading: isBankLoading } = useBanks(formData.type);
  let bankOptions = banks
    ?.filter((bank) => bank.name !== "Cash")
    .map((bank: TBank) => ({
      label: bank.name,
      value: bank.id,
    }));

  const initNameField = useCallback(() => {
    if (
      !!formData.bankSelect?.value &&
      (formData.type !== "investment" || formData.invType === "fd")
    )
      setValue(
        "name",
        `${formData.bankSelect.label} ${capitalize(formData.type)}`
      );
  }, [formData.bankSelect, formData.type, formData.invType, setValue]);

  const handleAcctTypeChange = useCallback(
    (selected: TAccountType) => {
      setValue("type", selected);
      if (selected === "investment") setValue("invType", "equity");
      else initNameField();
      setStep((prev) => prev + 1);
    },
    [initNameField, setStep, setValue]
  );

  const handleBankChange = useCallback(
    (event: unknown) => {
      const selected = event as TBankOption;
      if (!selected) {
        setValue("bankId", 0);
        setValue("bankSelect.label", undefined);
        setValue("bankSelect.value", 0);
      } else {
        setValue("bankSelect.label", selected.label);
        setValue("bankSelect.value", selected.value);
        setValue("bankId", selected.value);
        initNameField();
      }
    },
    [initNameField, setValue]
  );

  const handleBankCreate = useCallback(
    async (inputValue: string) => {
      const { success } = NewBankSchema.safeParse({
        name: inputValue,
        type: formData.type,
      });
      if (!success) {
        toast({
          title: "Error",
          description: "Invalid bank parameters",
          variant: "destructive",
        });
        return;
      }
      const resp = await createBank({
        name: inputValue,
        type: formData.type as TBankType,
        bankType: { value: formData.type, label: inputValue },
      });
      if (resp.success) {
        bankOptions?.push({ label: inputValue, value: resp.id! });
        setValue("bankId", resp.id!);
        setValue("bankSelect.label", inputValue);
        setValue("bankSelect.value", resp.id!);
        initNameField();
      } else
        toast({
          title: "Error",
          description: resp.message,
          variant: "destructive",
        });
    },
    [bankOptions, formData.type, initNameField, setValue, toast]
  );

  return {
    step,
    setStep,
    initNameField,
    handleBankChange,
    handleAcctTypeChange,
    handleBankCreate,
    isBankLoading,
    bankOptions,
  };
}
