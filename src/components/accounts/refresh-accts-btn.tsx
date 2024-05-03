"use client";

import { refreshBalances } from "@/lib/db/mutations/accounts.mutations";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";

export function RefreshAcctsBtn() {
  return (
    <Button
      variant={"ghost"}
      size="icon"
      onClick={async () => await refreshBalances()}
      className="size-4"
    >
      <RefreshCcw className="size-4 text-muted-foreground" />
    </Button>
  );
}
