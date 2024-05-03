import { TAccountType } from "@/types";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { ModalForm } from "../ui/modal-form";
import { AddAccountForm } from "./forms/add-account-form";

type Props = {
  type?: TAccountType;
};

export function AddAccountBtn({ type }: Props) {
  return (
    <ModalForm
      button={
        <Button>
          <PlusCircle className="size-4 mr-2" />{" "}
          <span className="hidden md:flex">Add Account</span>
        </Button>
      }
      title="Add Account"
      description="Enter details for new account"
      form={<AddAccountForm type={type} />}
    />
  );
}
