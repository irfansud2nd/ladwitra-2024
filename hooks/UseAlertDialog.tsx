"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const useConfirmationDialog = () => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState({
    title: "",
    message: "",
  });
  const [options, SetOptions] = useState({
    cancelLabel: "",
    cancelOnly: false,
  });
  const [resolveCallback, setResolveCallback] = useState<any>(null);

  const confirm = (
    title: string,
    message: string,
    options?: { cancelLabel?: string; cancelOnly?: boolean }
  ) => {
    setContent({
      title,
      message,
    });
    SetOptions({
      cancelLabel: options?.cancelLabel || "",
      cancelOnly: options?.cancelOnly || false,
    });
    setOpen(true);
    return new Promise((resolve) => {
      setResolveCallback(() => resolve);
    });
  };

  const handleConfirm = (result: boolean) => {
    resolveCallback(result);
    setOpen(false);
  };

  const handleOpenChange = (state: boolean) => {
    setOpen(state);
    if (!state) handleConfirm(false);
  };

  const ConfirmationDialog = () => (
    <AlertDialog open={open} onOpenChange={(state) => handleOpenChange(state)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="capitalize">
            {content.title}
          </AlertDialogTitle>
          <AlertDialogDescription>{content.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant={"secondary"}
            onClick={() => handleConfirm(false)}
            asChild
          >
            <AlertDialogCancel>
              {options.cancelLabel ? options.cancelLabel : "Batal"}
            </AlertDialogCancel>
          </Button>
          {!options.cancelOnly && (
            <Button
              asChild
              variant={"destructive"}
              onClick={() => handleConfirm(true)}
            >
              <AlertDialogAction>Ya</AlertDialogAction>
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    confirm,
    ConfirmationDialog,
  };
};
export default useConfirmationDialog;
