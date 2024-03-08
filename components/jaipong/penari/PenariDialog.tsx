"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { setPenariToEditRedux } from "@/utils/redux/jaipong/penarisSlice";
import { penariInitialValue } from "@/utils/jaipong/penari/penariConstants";
import PenariForm from "./PenariForm";
import { editOnly, jaipongLimit } from "@/utils/constants";

const PenariDialog = () => {
  const [open, setOpen] = useState(false);
  const penariToEdit = useSelector((state: RootState) => state.penaris.toEdit);
  const limit = useSelector(
    (state: RootState) => state.pendaftaran.jaipongLimit
  );
  const dispatch = useDispatch();

  const disable = editOnly || limit >= jaipongLimit;

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
      <DialogTrigger asChild>
        <Button disabled={disable}>Tambah Penari</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[100vw] max-h-[90vh] overflow-auto pb-2">
        <PenariForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
export default PenariDialog;
