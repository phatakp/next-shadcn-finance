import { TFullAccount } from "@/types";
import { ModalForm } from "../ui/modal-form";
import { AccountListItem } from "./cards/account-list-item";
import { UpdateAccountForm } from "./forms/update-account-form";

type Props = {
  account: TFullAccount;
};

export function UpdateAccountBtn({ account }: Props) {
  return (
    <ModalForm
      button={<AccountListItem account={account} />}
      title="Modify Account"
      description="Confirm details to modify account"
      form={<UpdateAccountForm account={account} />}
    />
  );
}
