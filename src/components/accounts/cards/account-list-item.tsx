"use client";

import { AmountField } from "@/components/common/amount-field";
import { useModalContext } from "@/components/ui/modal-form";
import { TableCell, TableRow } from "@/components/ui/table";
import { maskAccount } from "@/lib/utils";
import { TAccountType, TFullAccount } from "@/types";

type Props = {
  account: TFullAccount;
};
export function AccountListItem({ account }: Props) {
  const { openModal } = useModalContext();

  return (
    <TableRow className="cursor-pointer" onClick={openModal}>
      <TableCell>
        <div className="font-medium">
          {maskAccount(account.number, account.type as TAccountType)}
        </div>
        <div className="hidden text-sm text-muted-foreground md:inline truncate capitalize">
          {account.name}
        </div>
      </TableCell>
      <TableCell className="">{account.bank.name}</TableCell>
      {account.type === "investment" && (
        <>
          <TableCell className="hidden md:table-column">
            {account.asOfDate}
          </TableCell>
          <TableCell className="hidden md:table-column md:text-right">
            <AmountField amount={account.balance} className="text-base" />
          </TableCell>
        </>
      )}

      <TableCell className="text-right">
        <AmountField
          amount={account.currValue}
          className="text-base justify-end"
        />
      </TableCell>
    </TableRow>
  );
}
