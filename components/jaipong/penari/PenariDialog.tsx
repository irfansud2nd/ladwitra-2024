"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { setPenariToEditRedux } from "@/utils/redux/jaipong/penarisSlice";
import { penariInitialValue } from "@/utils/jaipong/penari/penariConstants";
import PenariForm from "./PenariForm";
import { closePayment, closePendaftaran, editOnly } from "@/utils/constants";

const PenariDialog = () => {
  const [open, setOpen] = useState(false);
  const penariToEdit = useSelector((state: RootState) => state.penaris.toEdit);
  const { jaipongLimit } = useSelector((state: RootState) => state.count);
  const dispatch = useDispatch();

  const disableAdd =
    editOnly || jaipongLimit || closePayment || closePendaftaran;

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (penariToEdit.id && !state)
      dispatch(setPenariToEditRedux(penariInitialValue));
  };

  useEffect(() => {
    if (penariToEdit.id) setOpen(true);
  }, [penariToEdit]);

  return (
    <Dialog onOpenChange={(state) => toggleDialog(state)} open={open}>
      {!disableAdd && (
        <DialogTrigger asChild>
          <Button>Tambah Penari</Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-fit max-w-[100vw] max-h-[90vh] overflow-auto pb-2">
        <PenariForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
export default PenariDialog;
