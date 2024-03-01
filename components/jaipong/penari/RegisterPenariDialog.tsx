"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { JenisTarian } from "@/utils/jaipong/penari/penariConstants";
import { useState } from "react";
import RegisterPenariForm from "./RegisterPenariForm";

const RegisterPenariDialog = ({ jenis }: { jenis: JenisTarian }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>Tambah Penari</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[100vw] max-h-screen overflow-auto">
        <RegisterPenariForm setOpen={setOpen} jenis={jenis} />
      </DialogContent>
    </Dialog>
  );
};
export default RegisterPenariDialog;
