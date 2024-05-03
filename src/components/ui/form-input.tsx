"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  desc?: string;
  isLoading?: boolean;
}

export const FormInput: FC<FormInputProps> = ({
  name,
  type,
  value,
  label,
  desc,
  className,
  onChange,
  disabled,
  placeholder,
  isLoading = false,
}) => {
  const {
    control,
    formState: { errors, isSubmitting },
  } = useFormContext();
  const error = errors[name!]?.message ?? "";

  return (
    <FormField
      control={control}
      name={name!}
      render={({ field }) => {
        const { value: fvalue, onChange: fChange, ...props } = field;
        return (
          <FormItem
            className={cn(
              "animate-in zoom-in-95 fade-in-0 slide-in-from-left-2 duration-500",
              type === "hidden" ? "w-0" : "w-full"
            )}
          >
            <FormControl>
              <div className="relative z-0 w-full group">
                <Input
                  type={type}
                  value={value ?? fvalue}
                  onChange={onChange ?? fChange}
                  className={cn(
                    "h-10 peer",
                    error && "border-destructive text-destructive",
                    !value && error && "focus-visible:ring-destructive",
                    className
                  )}
                  disabled={disabled || isSubmitting || isLoading}
                  placeholder={" "}
                  {...props}
                />
                <FormLabel
                  className={cn(
                    "peer-focus:font-medium px-2 absolute text-sm bg-background text-foreground duration-300 transform -translate-y-6 scale-75 top-4 left-3 z-10 rounded-sm origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:bg-muted peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:-translate-y-2 peer-placeholder-shown:py-1 peer-focus:scale-75 peer-focus:bg-background peer-focus:text-foreground peer-focus:-translate-y-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    disabled && "text-muted-foreground opacity-70",
                    error &&
                      "text-destructive peer-placeholder-shown:bg-destructive peer-placeholder-shown:text-destructive-foreground ",
                    type === "hidden" && "hidden"
                  )}
                >
                  {label}
                </FormLabel>
                <FormMessage
                  className={cn("peer", !!value && "peer-focus-visible:hidden")}
                >
                  {error as string}
                </FormMessage>
              </div>
            </FormControl>
            <FormDescription>{desc}</FormDescription>
          </FormItem>
        );
      }}
    />
  );
};
