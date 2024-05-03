export const constants = {
  acctTypes: [
    "savings",
    "investment",
    "mortgage",
    "credit-card",
    "wallet",
  ] as const,
  txnTypes: ["expense", "income", "transfer"] as const,
  invTypes: ["equity", "fund", "fd"] as const,
  parentCategories: [
    "food",
    "transportation",
    "household",
    "utilities",
    "health",
    "personal",
    "income",
    "transfer",
    "miscellaneous",
  ] as const,
  frequency: [
    "daily",
    "weekly",
    "biweekly",
    "monthly",
    "quarterly",
    "half-yearly",
    "annually",
  ] as const,
};