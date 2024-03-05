"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import RegisterAtletForm from "./RegisterAtletForm";
import { JenisPertandingan } from "@/utils/silat/atlet/atletConstats";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";

const RegisterAtletDialog = ({ jenis }: { jenis: JenisPertandingan }) => {
  const [open, setOpen] = useState(false);
  const atlets = useSelector((state: RootState) => state.atlets.all);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={atlets.length == 0}>Tambah Atlet</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[100vw] max-h-screen overflow-auto">
        <RegisterAtletForm setOpen={setOpen} jenis={jenis} />
      </DialogContent>
    </Dialog>
  );
};
export default RegisterAtletDialog;
