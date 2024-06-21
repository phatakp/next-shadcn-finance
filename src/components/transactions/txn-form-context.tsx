import { useToast } from "@/components/ui/use-toast";
import { useAccounts } from "@/hooks/use-accounts";
import { useCategories } from "@/hooks/use-categories";
import { useGroups } from "@/hooks/use-groups";
import { getBalance } from "@/lib/db/queries/accounts.queries";
import {
  TAccountOption,
  TAccountType,
  TCategoryOption,
  TCategoryParent,
  TFrequencyOption,
  TGroupOption,
  TNewTxnParams,
  TransactionType,
} from "@/types";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useFormContext } from "react-hook-form";

const TxnFormContext = createContext({});

export default function TxnFormProvider({ children }: { children: ReactNode }) {
  return (
    <TxnFormContext.Provider value={{}}>{children}</TxnFormContext.Provider>
  );
}

export function useTxnFormContext() {
  const context = useContext(TxnFormContext);
  if (!context) throw new Error("Txn Form context should be inside a provider");

  const { watch, setValue, setError, clearErrors } =
    useFormContext<TNewTxnParams>();
  const { toast } = useToast();
  const formData = watch();

  useEffect(() => {
    if (formData.categoryId === 0)
      setError("categorySelect", { message: "Required", type: "required" });
    else clearErrors("categorySelect");
  }, [formData.categoryId, setError, clearErrors]);

  const { data: groups, isLoading: isGroupLoading } = useGroups();
  const groupOptions = groups?.map((grp) => ({
    label: grp.name,
    value: grp.id,
  }));

  const { data: sourceAccts, isLoading: isSourceLoading } = useAccounts(
    formData.type as TransactionType,
    formData.sourceId
  );
  let srcOptions: {
    label: TAccountType;
    options: TAccountOption[];
  }[] = [];
  if (sourceAccts) {
    const result = Object.groupBy(sourceAccts, ({ type }) => type);
    srcOptions = Object.entries(result).map(([key, option]) => ({
      label: key as TAccountType,
      options: option!.map((o) => ({
        value: o.id,
        label: o.type === "investment" ? `${o.bank.name}-${o.name}` : o.name,
      })),
    }));
  }

  const { data: destAccts, isLoading: isDestLoading } = useAccounts(
    formData.type as TransactionType,
    formData.sourceId,
    true
  );
  let destOptions: {
    label: TAccountType;
    options: TAccountOption[];
  }[] = [];
  if (destAccts) {
    const result = Object.groupBy(destAccts, ({ type }) => type);
    destOptions = Object.entries(result).map(([key, option]) => ({
      label: key as TAccountType,
      options: option!.map((o) => ({
        value: o.id,
        label: o.type === "investment" ? `${o.bank.name}-${o.name}` : o.name,
      })),
    }));
  }

  const { data: categories, isLoading: isCatLoading } = useCategories(
    formData.type as TransactionType
  );
  let categoryOptions: {
    label: TCategoryParent;
    options: TCategoryOption[];
  }[] = [];
  if (categories) {
    const result = Object.groupBy(categories, ({ parent }) => parent);
    categoryOptions = Object.entries(result).map(([key, option]) => ({
      label: key as TCategoryParent,
      options: option!.map((o) => ({
        value: o.id,
        label: o.name,
      })),
    }));
  }

  const handleCategoryChange = useCallback(
    (event: unknown) => {
      const selected = event as TCategoryOption;
      if (!selected) {
        setValue("categoryId", 0);
        setValue("categorySelect.label", undefined);
        setValue("categorySelect.value", 0);
      } else {
        setValue("categorySelect.label", selected.label);
        setValue("categorySelect.value", selected.value);
        setValue("categoryId", selected.value);
      }
    },
    [setValue]
  );

  const handleGroupChange = useCallback(
    (event: unknown) => {
      const selected = event as TGroupOption;
      if (!selected) {
        setValue("groupId", 0);
        setValue("groupSelect.label", undefined);
        setValue("groupSelect.value", 0);
      } else {
        setValue("groupSelect.label", selected.label);
        setValue("groupSelect.value", selected.value);
        setValue("groupId", selected.value);
      }
    },
    [setValue]
  );

  const handleSourceChange = useCallback(
    async (event: unknown) => {
      const selected = event as TAccountOption;
      if (!selected) {
        setValue("sourceId", 0);
        setValue("sourceSelect.label", undefined);
        setValue("sourceSelect.value", 0);
      } else {
        setValue("sourceSelect.label", selected.label);
        setValue("sourceSelect.value", selected.value);
        setValue("sourceId", selected.value);
        const balance = await getBalance(selected.value);
        setValue("srcBalance", balance);
        clearErrors("sourceSelect");
      }
    },
    [setValue, clearErrors]
  );
  const handleDestinationChange = useCallback(
    async (event: unknown) => {
      const selected = event as TAccountOption;
      if (!selected) {
        setValue("destinationId", 0);
        setValue("destinationSelect.label", undefined);
        setValue("destinationSelect.value", 0);
      } else {
        setValue("destinationSelect.label", selected.label);
        setValue("destinationSelect.value", selected.value);
        setValue("destinationId", selected.value);
        const balance = await getBalance(selected.value);
        setValue("destBalance", balance);
        clearErrors("destinationSelect");
      }
    },
    [setValue, clearErrors]
  );

  const handleFrequencyChange = useCallback(
    (event: unknown) => {
      const selected = event as TFrequencyOption;
      setValue("frequencySelect.label", selected.label);
      setValue("frequencySelect.value", selected.value);
      setValue("frequency", selected.value);
    },
    [setValue]
  );

  return {
    handleCategoryChange,
    isCatLoading,
    categoryOptions,
    handleGroupChange,
    isGroupLoading,
    groupOptions,
    handleSourceChange,
    handleDestinationChange,
    isSourceLoading,
    srcOptions,
    isDestLoading,
    destOptions,
    handleFrequencyChange,
  };
}
