"use client";
import ShowFile from "@/components/admin/ShowFile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

const useShowFileDialog = () => {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [title, setTitle] = useState("");
  const [landscape, setLandscape] = useState(false);
  const [resolveCallback, setResolveCallback] = useState<any>(null);

  const showFile = (title: string, src: string, landscape: boolean = false) => {
    setSrc(src);
    setTitle(title);
    setLandscape(landscape);
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

  const ShowFileDialog = () => (
    <Dialog open={open} onOpenChange={(state) => handleOpenChange(state)}>
      <DialogContent className="w-fit">
        <ShowFile label={title} src={src} landscape={landscape} />
      </DialogContent>
    </Dialog>
  );

  return {
    showFile,
    ShowFileDialog,
  };
};
export default useShowFileDialog;
