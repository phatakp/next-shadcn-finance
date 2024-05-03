import { accounts } from "@/lib/db/schema/accounts.schema";
import { banks } from "@/lib/db/schema/banks.schema";
import { categories } from "@/lib/db/schema/categories.schema";

import { groups } from "@/lib/db/schema/groups.schema";
import { transactions } from "@/lib/db/schema/transactions.schema";
import { users } from "@/lib/db/schema/users.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { constants } from "../config/constants";

// Schema for users - used to validate API requests
const UserSchema = createSelectSchema(users);
export const NewUserSchema = UserSchema.omit({
  createdAt: true,
});
export const UpdateUserSchema = UserSchema.omit({
  email: true,
  createdAt: true,
});
export const UserIdSchema = UserSchema.pick({ id: true });

// Schema for banks - used to validate API requests
const BankSchema = createSelectSchema(banks);
export const NewBankSchema = createInsertSchema(banks);
export const NewBankParams = NewBankSchema.extend({
  type: z.enum(constants.acctTypes),
  bankType: z.object({ label: z.any(), value: z.string() }),
});
export const BankIdSchema = BankSchema.pick({ id: true });

// Schema for categories - used to validate API requests
const CategorySchema = createSelectSchema(categories);
export const NewCategorySchema = createInsertSchema(categories);
export const NewCategoryParams = NewCategorySchema.extend({
  parentSelect: z.object({ label: z.any(), value: z.string() }),
});
export const UpdateCategoryParams = CategorySchema.extend({
  parentSelect: z.object({ label: z.any(), value: z.string() }),
});
export const CategoryIdSchema = CategorySchema.pick({ id: true });

// Schema for accounts - used to validate API requests
const AccountSchema = createSelectSchema(accounts);
export const NewAccountSchema = createInsertSchema(accounts);
export const NewAccountParams = AccountSchema.extend({
  name: z.string({ required_error: "Acct Name is required" }),
  number: z.string(),
  balance: z.coerce.number().optional(),
  asOfDate: z.string().min(8),
  bankId: z.coerce
    .number({ required_error: "Bank is required" })
    .min(1, "Bank is required"),
  bankSelect: z
    .object({ label: z.any(), value: z.coerce.number().optional() })
    .required(),

  //Investment account fields
  currValue: z.coerce
    .number({ required_error: "Curr Value is required" })
    .optional(),
  invType: z.enum(constants.invTypes).optional(),

  //Mutual Funds only
  units: z.coerce.number({ required_error: "Units is required" }).optional(),
  nav: z.coerce.number({ required_error: "NAV is required" }).optional(),

  //Stocks only
  moneyControlPrefix: z
    .string({ required_error: "Prefix is required" })
    .optional(),
  buyPrice: z.coerce
    .number({ required_error: "Buy Price is required" })
    .optional(),
  currPrice: z.coerce
    .number({ required_error: "Curr Price is required" })
    .optional(),
  quantity: z.coerce
    .number({ required_error: "Quantity is required" })
    .optional(),
})
  .omit({
    id: true,
    userId: true,
  })
  .superRefine(
    (
      {
        type,
        balance,
        invType,
        units,
        quantity,
        moneyControlPrefix,
        currPrice,
        buyPrice,
        nav,
        currValue,
      },
      context
    ) => {
      if (
        type !== "investment" &&
        (!!invType ||
          !!units ||
          !!quantity ||
          !!moneyControlPrefix ||
          !!currPrice ||
          !!buyPrice ||
          !!nav)
      ) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Investment fields should not be populated",
          path: ["type"],
        });
      }

      if (type === "investment" && !invType) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Investment type is required",
          path: ["invType"],
        });
      }

      if (type === "investment" && invType === "fund" && !units) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Units is required",
          path: ["units"],
        });
      }

      if (type === "investment" && invType === "fund" && !nav) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "NAV is required",
          path: ["nav"],
        });
      }

      if (
        type === "investment" &&
        invType === "equity" &&
        !moneyControlPrefix
      ) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Prefix is required",
          path: ["moneyControlPrefix"],
        });
      }

      if (type === "investment" && invType === "equity" && !quantity) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Quantity is required",
          path: ["quantity"],
        });
      }

      if (type === "investment" && invType === "equity" && !buyPrice) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Buy Price is required",
          path: ["buyPrice"],
        });
      }

      if (type === "investment" && invType === "equity" && !currPrice) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Curr Price is required",
          path: ["currPrice"],
        });
      }

      if (!balance) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required",
          path: ["balance"],
        });
      }

      if (type === "investment" && !currValue) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Curr Value is required",
          path: ["currValue"],
        });
      }
    }
  );

export const UpdateAccountSchema = AccountSchema.omit({
  userId: true,
})
  .extend({
    id: z.coerce
      .number({ required_error: "Account ID is required" })
      .readonly(),
    name: z
      .string({ required_error: "Acct Name is required" })
      .min(1, "Acct Name is required"),
    balance: z.coerce.number().optional(),
    bankSelect: z
      .object({ label: z.any(), value: z.coerce.number() })
      .required(),

    //Investment account fields
    currValue: z.coerce
      .number({ required_error: "Curr Value is required" })
      .optional(),
    invType: z.enum(constants.invTypes).optional(),

    //Mutual Funds only
    units: z.coerce.number({ required_error: "Units is required" }).optional(),
    nav: z.coerce.number({ required_error: "NAV is required" }).optional(),

    //Stocks only
    moneyControlPrefix: z
      .string({ required_error: "Prefix is required" })
      .optional(),
    buyPrice: z.coerce
      .number({ required_error: "Buy Price is required" })
      .optional(),
    currPrice: z.coerce
      .number({ required_error: "Curr Price is required" })
      .optional(),
    quantity: z.coerce
      .number({ required_error: "Quantity is required" })
      .optional(),
  })
  .superRefine(
    (
      {
        type,
        balance,
        invType,
        units,
        quantity,
        moneyControlPrefix,
        currPrice,
        buyPrice,
        nav,
        currValue,
      },
      context
    ) => {
      if (
        type !== "investment" &&
        (!!invType ||
          !!units ||
          !!quantity ||
          !!moneyControlPrefix ||
          !!currPrice ||
          !!buyPrice ||
          !!nav)
      ) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Investment fields should not be populated",
          path: ["type"],
        });
      }

      if (type === "investment" && !invType) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Investment type is required",
          path: ["invType"],
        });
      }

      if (type === "investment" && invType === "fund" && !units) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Units is required",
          path: ["units"],
        });
      }

      if (type === "investment" && invType === "fund" && !nav) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "NAV is required",
          path: ["nav"],
        });
      }

      if (
        type === "investment" &&
        invType === "equity" &&
        !moneyControlPrefix
      ) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Prefix is required",
          path: ["moneyControlPrefix"],
        });
      }

      if (type === "investment" && invType === "equity" && !quantity) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Quantity is required",
          path: ["quantity"],
        });
      }

      if (type === "investment" && invType === "equity" && !buyPrice) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Buy Price is required",
          path: ["buyPrice"],
        });
      }

      if (type === "investment" && invType === "equity" && !currPrice) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Curr Price is required",
          path: ["currPrice"],
        });
      }

      if (!balance) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required",
          path: ["balance"],
        });
      }

      if (type === "investment" && !currValue) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Curr Value is required",
          path: ["currValue"],
        });
      }
    }
  );

export const AccountIdSchema = AccountSchema.pick({ id: true });

// Schema for transactions - used to validate API requests
const TransactionSchema = createSelectSchema(transactions);
export const NewTxnSchema = createInsertSchema(transactions);
export const NewTxnParams = TransactionSchema.omit({
  userId: true,
}).extend({
  amount: z.coerce.number(),
  date: z.coerce.date(),
  description: z.string().optional(),
  categoryId: z.coerce.number().min(1),
  categorySelect: z
    .object({ label: z.any(), value: z.coerce.number() })
    .optional(),
  sourceId: z.coerce.number().optional(),
  sourceSelect: z.object({
    label: z.any(),
    value: z.coerce.number().optional(),
  }),
  destinationId: z.coerce.number().optional(),
  destinationSelect: z.object({
    label: z.any(),
    value: z.coerce.number().optional(),
  }),
  groupId: z.coerce.number().optional(),
  groupSelect: z.object({
    label: z.any(),
    value: z.coerce.number().optional(),
  }),

  //Recurring txn fields
  startDate: z.string().min(8).optional(),
  endDate: z.string().min(8).optional(),
  frequency: z.enum(constants.frequency).optional(),
  frequencySelect: z.object({
    label: z.any(),
    value: z.enum(constants.frequency).optional(),
  }),
});

export const UpdateTxnSchema = TransactionSchema.omit({
  userId: true,
}).extend({
  id: z.coerce.number().readonly(),
  amount: z.coerce.number(),
  date: z.coerce.date(),
  description: z.string().optional(),
  categoryId: z.coerce.number().min(1),
  categorySelect: z.object({ label: z.any(), value: z.coerce.number() }),
  sourceId: z.coerce.number().optional(),
  sourceSelect: z.object({
    label: z.any(),
    value: z.coerce.number().optional(),
  }),
  destinationId: z.coerce.number().optional(),
  destinationSelect: z.object({
    label: z.any(),
    value: z.coerce.number().optional(),
  }),
  groupId: z.coerce.number().optional(),
  groupSelect: z.object({
    label: z.any(),
    value: z.coerce.number().optional(),
  }),

  //Recurring txn fields
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  frequency: z.enum(constants.frequency).optional(),
  frequencySelect: z.object({
    label: z.any(),
    value: z.enum(constants.frequency).optional(),
  }),
});

export const TxnIdSchema = TransactionSchema.pick({ id: true });

// Schema for groups - used to validate API requests
const GroupSchema = createSelectSchema(groups);
export const NewGroupSchema = createInsertSchema(groups);
export const NewGroupParams = NewGroupSchema.extend({
  userSelect: z.object({ label: z.any(), value: z.string() }),
});
export const UpdateGroupSchema = GroupSchema.extend({
  userSelect: z.object({ label: z.any(), value: z.string() }),
});
export const GroupIdSchema = GroupSchema.pick({ id: true });
