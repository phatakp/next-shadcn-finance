import { constants } from "@/lib/config/constants";
import { createEnumObject } from "@/lib/utils";
import { pgEnum } from "drizzle-orm/pg-core";

export const bankTypeObject = createEnumObject(constants.acctTypes);
export const bankTypeEnum = pgEnum("bankType", constants.acctTypes);

export const invTypeObject = createEnumObject(constants.invTypes);
export const invTypeEnum = pgEnum("invType", constants.invTypes);

export const txnTypeObject = createEnumObject(constants.txnTypes);
export const txnTypeEnum = pgEnum("txnType", constants.txnTypes);

export const parentCategoryObject = createEnumObject(
  constants.parentCategories
);
export const parentCategoryEnum = pgEnum(
  "parentCategory",
  constants.parentCategories
);

export const frequencyObject = createEnumObject(constants.frequency);
export const frequencyEnum = pgEnum("frequency", constants.frequency);
