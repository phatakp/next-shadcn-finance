import { accounts } from "@/lib/db/schema/accounts.schema";
import { banks } from "@/lib/db/schema/banks.schema";
import { categories } from "@/lib/db/schema/categories.schema";
import {
  bankTypeObject,
  frequencyObject,
  invTypeObject,
  parentCategoryObject,
  txnTypeObject,
} from "@/lib/db/schema/enums.schema";
import { users } from "@/lib/db/schema/users.schema";
import {
  AccountIdSchema,
  BankIdSchema,
  CategoryIdSchema,
  GroupIdSchema,
  NewAccountParams,
  NewAccountSchema,
  NewBankParams,
  NewBankSchema,
  NewCategoryParams,
  NewCategorySchema,
  NewGroupParams,
  NewGroupSchema,
  NewTxnParams,
  NewTxnSchema,
  NewUserSchema,
  TxnIdSchema,
  UpdateAccountSchema,
  UpdateCategoryParams,
  UpdateGroupSchema,
  UpdateTxnSchema,
  UpdateUserSchema,
  UserIdSchema,
} from "@/lib/drizzle/zod-schemas";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { z } from "zod";
import { groups } from "./lib/db/schema/groups.schema";
import { transactions } from "./lib/db/schema/transactions.schema";

//Generic Types
export type TActionResp = {
  success: boolean;
  message: string;
  id?: number;
};

export type TAction = "add" | "update" | "delete";

export type TSelectOption = {
  label: ReactNode;
  value: string | number | string[] | undefined | null;
};

export type TSelectGroupOption = {
  group: string;
  options: TSelectOption[];
};

export type TSelectActionTypes =
  | "clear"
  | "create-option"
  | "deselect-option"
  | "pop-value"
  | "remove-value"
  | "select-option"
  | "set-value";

export type TAuthUser = {
  object: "user";
  id: string;
  email: string;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  profilePictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TSidebarLink = {
  title: string;
  href: string;
  icon: LucideIcon;
};

// Types for users - used to type API request params and within Components
export type TUser = typeof users.$inferSelect;
export type TNewUserParams = z.infer<typeof NewUserSchema>;
export type TUpdateUserParams = z.infer<typeof UpdateUserSchema>;
export type TUserId = z.infer<typeof UserIdSchema>["id"];

// Types for banks - used to type API request params and within Components
export type TBank = typeof banks.$inferSelect;
export type TNewBank = z.infer<typeof NewBankSchema>;
export type TNewBankParams = z.infer<typeof NewBankParams>;
export type TBankId = z.infer<typeof BankIdSchema>["id"];
export type TBankType = keyof typeof bankTypeObject;
export type TBankOption = { label: string; value: TBankId };

// Types for categories - used to type API request params and within Components
export type TCategory = typeof categories.$inferSelect;
export type TNewCategory = z.infer<typeof NewCategorySchema>;
export type TNewCategoryParams = z.infer<typeof NewCategoryParams>;
export type TUpdateCategoryParams = z.infer<typeof UpdateCategoryParams>;
export type TCategoryId = z.infer<typeof CategoryIdSchema>["id"];
export type TCategoryParent = keyof typeof parentCategoryObject;
export type TCategoryOption = { label: string; value: TCategoryId };

// Types for accounts - used to type API request params and within Components
export type TAccount = typeof accounts.$inferSelect;
export type TNewAccount = z.infer<typeof NewAccountSchema>;
export type TNewAccountParams = z.infer<typeof NewAccountParams>;
export type TUpdateAccountParams = z.infer<typeof UpdateAccountSchema>;
export type TAccountId = z.infer<typeof AccountIdSchema>["id"];
export type TAccountType = keyof typeof bankTypeObject;
export type TInvestmentType = keyof typeof invTypeObject;
export type TFullAccount = TAccount & { user: TUser; bank: TBank };
export type TAccountTypeOption = { label: string; value: TAccountType };
export type TInvTypeOption = { label: string; value: TInvestmentType };

// Types for mutualFunds - used to type API request params and within Components
export type TMFAPIData = {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: [
    {
      date: string;
      nav: string;
    }
  ];
  status: string;
};

export type TEquityData = {
  stockName: string;
  price: number;
};

// Types for groups - used to type API request params and within Components
export type TGroup = typeof groups.$inferSelect;
export type TNewGroup = z.infer<typeof NewGroupSchema>;
export type TNewGroupParams = z.infer<typeof NewGroupParams>;
export type TUpdateGroupParams = z.infer<typeof UpdateGroupSchema>;
export type TGroupId = z.infer<typeof GroupIdSchema>["id"];
export type TGroupOption = { label: string; value: TGroupId };

// Types for transactions - used to type API request params and within Components
export type Transaction = typeof transactions.$inferSelect;
export type TNewTxn = z.infer<typeof NewTxnSchema>;
export type TNewTxnParams = z.infer<typeof NewTxnParams>;
export type TUpdateTxnParams = z.infer<typeof UpdateTxnSchema>;
export type TransactionId = z.infer<typeof TxnIdSchema>["id"];
export type TransactionType = keyof typeof txnTypeObject;
export type TFrequencyType = keyof typeof frequencyObject;
export type TFullTxn = Transaction & {
  user: TUser;
  category: TCategory;
  source: TAccount | null;
  destination: TAccount | null;
  group: TGroup | null;
};
export type TAccountOption = { label: string; value: TAccountId };
export type TFrequencyOption = { label: string; value: TFrequencyType };
