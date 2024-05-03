"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Button } from "./button";

type ModalContextProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ModalContext = createContext({} as ModalContextProps);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Modal not used within Modal Context");

  const { open, setOpen } = context;
  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);
  return { open, setOpen, closeModal, openModal };
}

type Props = {
  button: ReactNode;
  title: string;
  description: string;
  form: ReactNode;
  defaultOpen?: boolean;
};
export function ModalForm({
  button,
  title,
  description,
  form,
  defaultOpen,
}: Props) {
  const [open, setOpen] = useState(!!defaultOpen ?? false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>{button}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="capitalize">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="my-8">{form}</div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>{button}</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle className="capitalize">{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 py-8">{form}</div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </ModalContext.Provider>
  );
}
