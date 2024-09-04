"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import RegisterAtletForm from "./RegisterAtletForm";
import {
  JenisPertandingan,
  atletInitialValue,
} from "@/utils/silat/atlet/atletConstants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { closePayment, closePendaftaran, editOnly } from "@/utils/constants";
import { setPertandinganToEditRedux } from "@/utils/redux/silat/atletsSlice";

const RegisterAtletDialog = ({ jenis }: { jenis: JenisPertandingan }) => {
  const [open, setOpen] = useState(false);

  const { all: atlets, pertandinganToEdit } = useSelector(
    (state: RootState) => state.atlets
  );
  const { silatLimit } = useSelector((state: RootState) => state.count);

  const dispatch = useDispatch();

  const disableAdd = editOnly || silatLimit || closePayment || closePendaftaran;

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (pertandinganToEdit.id && !state)
      dispatch(setPertandinganToEditRedux(atletInitialValue));
  };

  useEffect(() => {
    if (pertandinganToEdit.id) setOpen(true);
  }, [pertandinganToEdit]);

  return (
    <Dialog onOpenChange={(value) => toggleDialog(value)} open={open}>
      {!disableAdd && (
        <DialogTrigger asChild>
          <Button disabled={atlets.length == 0}>Tambah Atlet</Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-fit max-w-[100vw] max-h-screen overflow-auto">
        <RegisterAtletForm setOpen={setOpen} jenis={jenis} />
      </DialogContent>
    </Dialog>
  );
};
export default RegisterAtletDialog;
