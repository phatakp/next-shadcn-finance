"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { Switch } from "./switch";

interface FormSwitchProps {
  label: string;
  desc?: string;
  value: boolean | undefined;
  name: string;
  disabled?: boolean;
}
export function FormSwitch({
  name,
  label,
  desc,
  disabled = false,
  value,
}: FormSwitchProps) {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const error = !!errors[name!]?.message;

  return (
    <FormField
      control={control}
      name={name!}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border px-3 pb-1 shadow-sm relative z-0 w-full group h-10">
          <FormLabel
            className={cn(
              "peer-focus:font-medium px-2 absolute text-sm bg-background text-foreground duration-300 transform -translate-y-6 scale-75 top-4 left-3 z-10 rounded-sm origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-muted peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:-translate-y-2 peer-placeholder-shown:py-1 peer-focus:scale-75 peer-focus:bg-background peer-focus:text-foreground peer-focus:-translate-y-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              disabled && "text-muted-foreground opacity-70",
              error && "text-destructive"
            )}
          >
            {label}
          </FormLabel>
          <FormDescription className="pl-1 text-sm truncate">
            {desc}
          </FormDescription>

          <FormControl>
            <Switch
              checked={value ?? field.value}
              onCheckedChange={field.onChange}
              disabled={disabled || isSubmitting}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
