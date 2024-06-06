import { TAccountType, TActionResp } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleError(err: unknown): TActionResp {
  let message = "Could not process your request";
  if (err instanceof Error)
    message = err.message.length > 0 ? err.message : message;
  else if (err instanceof ZodError)
    message = err.message.length > 0 ? err.message : message;
  else if (err && typeof err === "object" && "error" in err) {
    const errAsStr = err.error as string;
    message = errAsStr.length > 0 ? errAsStr : message;
  }
  console.error(message);
  return { success: false, message };
}

export const createEnumObject = <T extends readonly [string, ...string[]]>(
  values: T
): Record<T[number], T[number]> => {
  const obj: Record<string, T[number]> = {};
  for (const value of values) {
    obj[value] = value;
  }
  return obj;
};

export const amountFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const shortAmount = (amt: number) => {
  if (amt > 10000000) {
    const num = (amt / 10000000).toFixed(2);
    return num + "Cr";
  }
  if (amt > 100000) {
    const num = (amt / 100000).toFixed(2);
    return num + "L";
  }
  if (amt > 1000) {
    const num = (amt / 1000).toFixed(2);
    return num + "K";
  }
  return amt.toFixed();
};

export function getValueOf<T extends Record<string, any>>(
  key: keyof T,
  object: T
) {
  return object[key];
}

function mask(str: string, type: TAccountType) {
  if (str.length === 19 && type === "credit-card")
    return str.replace(/^.{14}/g, "XXXX-XXXX-XXXX");
  if (str.length > 4 && type !== "credit-card")
    return str.replace(/.(?=.{4})/g, "X");
  return str;
}

export const maskAccount = (number: string, type: TAccountType) => {
  switch (type) {
    case "credit-card":
      const masked = number
        .replace(/\D/g, "")
        .match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
      if (masked) {
        if (!masked[2]) return masked[1];
        else
          return mask(
            `${masked[1]}-${masked[2]}${`${
              masked[3] ? `-${masked[3]}` : ""
            }`}${`${masked[4] ? `-${masked[4]}` : ""}`}`,
            type
          );
      }
      return number;
      break;

    default:
      return mask(number, type);
      break;
  }
};

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
