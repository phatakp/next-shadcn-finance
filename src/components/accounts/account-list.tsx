"use client";

import { TFullAccount } from "@/types";
import { usePagination } from "../common/pagination-wrapper";
import { TableBody } from "../ui/table";
import { UpdateAccountBtn } from "./update-account-btn";

type Props = {
  accounts: TFullAccount[];
};

export function AccountList({ accounts }: Props) {
  const { start, end } = usePagination();
  const pageData = accounts.slice(start, end);
  return (
    <TableBody>
      {pageData.map((account) => (
        <UpdateAccountBtn key={account.id} account={account} />
      ))}
    </TableBody>
  );
}
