import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { ModalForm } from "../ui/modal-form";
import { AddTxnForm } from "./forms/add-txn-form";

export function AddTxnBtn() {
  return (
    <ModalForm
      button={
        <Button size={"sm"}>
          <PlusCircle className="size-4 mr-2" />{" "}
          <span className="hidden md:flex">Add Txn</span>
        </Button>
      }
      title="Add Transaction"
      description="Enter details for new transaction"
      form={<AddTxnForm />}
    />
  );
}
