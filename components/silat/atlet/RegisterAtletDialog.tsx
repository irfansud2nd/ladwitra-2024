"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import RegisterAtletForm from "./RegisterAtletForm";
import {
  JenisPertandingan,
  atletInitialValue,
} from "@/utils/silat/atlet/atletConstats";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { tutupPendaftaran, silatLimit } from "@/utils/constants";
import { setPertandinganToEditRedux } from "@/utils/redux/silat/atletsSlice";

const RegisterAtletDialog = ({ jenis }: { jenis: JenisPertandingan }) => {
  const [open, setOpen] = useState(false);
  const atlets = useSelector((state: RootState) => state.atlets.all);
  const pertandinganToEdit = useSelector(
    (state: RootState) => state.atlets.pertandinganToEdit
  );
  const limit = useSelector((state: RootState) => state.pendaftaran.silatLimit);
  const dispatch = useDispatch();

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (pertandinganToEdit.id && !state)
      dispatch(setPertandinganToEditRedux(atletInitialValue));
  };

  useEffect(() => {
    if (pertandinganToEdit.id) setOpen(true);
  }, [pertandinganToEdit]);

  const hide = limit >= silatLimit || tutupPendaftaran;

  return (
    <Dialog onOpenChange={(value) => toggleDialog(value)} open={open}>
      <DialogTrigger asChild>
        <Button disabled={atlets.length == 0} className={`${hide && "hidden"}`}>
          Tambah Atlet
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[100vw] max-h-screen overflow-auto">
        <RegisterAtletForm setOpen={setOpen} jenis={jenis} />
      </DialogContent>
    </Dialog>
  );
};
export default RegisterAtletDialog;
