"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  JenisTarian,
  penariInitialValue,
} from "@/utils/jaipong/penari/penariConstants";
import { useEffect, useState } from "react";
import RegisterPenariForm from "./RegisterPenariForm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { jaipongLimit, tutupPendaftaran } from "@/utils/constants";
import { setTarianToEditRedux } from "@/utils/redux/jaipong/penarisSlice";

const RegisterPenariDialog = ({ jenis }: { jenis: JenisTarian }) => {
  const [open, setOpen] = useState(false);
  const penaris = useSelector((state: RootState) => state.penaris.all);
  const tarianToEdit = useSelector(
    (state: RootState) => state.penaris.tarianToEdit
  );
  const limit = useSelector(
    (state: RootState) => state.pendaftaran.jaipongLimit
  );
  const dispatch = useDispatch();

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (tarianToEdit.id && !state)
      dispatch(setTarianToEditRedux(penariInitialValue));
  };

  useEffect(() => {
    if (tarianToEdit.id) setOpen(true);
  }, [tarianToEdit]);

  const hide = limit >= jaipongLimit || tutupPendaftaran;

  return (
    <Dialog onOpenChange={(value) => toggleDialog(value)} open={open}>
      <DialogTrigger asChild>
        <Button
          disabled={penaris.length == 0}
          className={`${hide && "hidden"}`}
        >
          Tambah Penari
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[100vw] max-h-screen overflow-auto">
        <RegisterPenariForm setOpen={setOpen} jenis={jenis} />
      </DialogContent>
    </Dialog>
  );
};
export default RegisterPenariDialog;
