import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ReactSelect from "react-select/creatable";

type SelectProps = ComponentPropsWithoutRef<typeof ReactSelect> & {
  label: string;
  desc?: string;
};

export const FormSelect: FC<SelectProps> = ({
  className,
  name,
  label,
  desc,
  value,
  isDisabled,
  isClearable = true,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name!]?.message ?? "";

  return (
    <Controller
      control={control}
      name={name!}
      render={({ field }) => (
        <FormItem
          className={cn(
            "relative animate-in zoom-in-95 fade-in-0 slide-in-from-left-2 duration-500 w-full",
            className
          )}
        >
          <FormControl>
            <div className="relative w-full group">
              <FormLabel
                className={cn(
                  "peer-focus:font-medium px-2 absolute text-sm bg-background text-foreground duration-300 transform -translate-y-6 scale-75 top-4 left-3 z-10 origin-[0] peer-focus:start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  isDisabled && "text-muted-foreground opacity-70",
                  error && "text-destructive"
                )}
              >
                {label}
              </FormLabel>
              <ReactSelect
                placeholder="Select a value.."
                isSearchable
                isClearable={isClearable}
                isDisabled={isDisabled}
                onChange={field.onChange}
                defaultValue={value ?? field.value}
                value={value ?? field.value}
                {...props}
                unstyled
                menuShouldScrollIntoView={false}
                styles={{
                  input: (base) => ({
                    ...base,
                    "input:focus": {
                      boxShadow: "none",
                    },
                  }),
                  // On mobile, the label will truncate automatically, so we want to
                  // override that behaviour.
                  multiValueLabel: (base) => ({
                    ...base,
                    whiteSpace: "normal",
                    overflow: "hidden",
                  }),
                  control: (base) => ({
                    ...base,
                    transition: "all",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 99,
                  }),
                }}
                classNames={{
                  placeholder: () => "text-muted-foreground",
                  input: () => "pl-3 peer",
                  valueContainer: () => "px-1 gap-2 capitalize",
                  clearIndicator: () =>
                    cn(
                      "border border-background bg-card hover:bg-card-hover text-card-foreground rounded-md",
                      error && "text-destructive"
                    ),
                  dropdownIndicator: () =>
                    cn(isDisabled && "text-muted-foreground"),
                  menu: () =>
                    cn(
                      "p-1 mt-2 border border-background bg-accent text-accent-foreground rounded-lg text-sm z-50 absolute"
                    ),
                  menuPortal: () => "shadow-md shadow-background z-50",

                  control: ({ isFocused, isDisabled }) =>
                    cn(
                      "flex peer h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      isDisabled && "cursor-not-allowed opacity-50",
                      !!error && "border-destructive text-destructive",
                      isFocused && "outline-none ring-0 border-primary"
                    ),

                  groupHeading: () =>
                    "text-base text-popover-foreground bg-popover font-semibold px-2 py-1 capitalize rounded",

                  option: ({ isFocused, isSelected }) =>
                    cn(
                      "hover:cursor-pointer px-3 py-2 rounded z-[99] text-foreground/80 capitalize",
                      isFocused &&
                        "bg-primary text-primary-foreground active:bg-primary active:text-primary-foreground",
                      isSelected &&
                        "before:content-['✔'] before:mr-2 before:text-green-500"
                    ),
                  multiValue: ({ isDisabled }) =>
                    cn(
                      "bg-primary text-primary-foreground rounded items-center py-0.5 pl-2 pr-1 gap-1 items-center relative",
                      isDisabled &&
                        "bg-muted text-muted-foreground cursor-not-allowed"
                    ),
                  multiValueLabel: () => "leading-6 py-0.5 truncate",
                  multiValueRemove: () =>
                    "bg-secondary text-secondary-foreground absolute -right-1 -top-1 rounded hover:bg-accent",
                }}
              />
              <FormMessage className="peer peer-focus-visible:hidden">
                {error as string}
              </FormMessage>
            </div>
          </FormControl>

          <FormDescription className="pl-3">{desc}</FormDescription>
        </FormItem>
      )}
    />
  );
};
