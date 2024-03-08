"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { setKoreograferToEditRedux } from "@/utils/redux/jaipong/koreografersSlice";
import { koreograferInitialValue } from "@/utils/jaipong/koreografer/koreograferConstants";
import KoreograferForm from "./KoreograferForm";
import { editOnly } from "@/utils/constants";

const KoreograferDialog = () => {
  const [open, setOpen] = useState(false);
  const koreograferToEdit = useSelector(
    (state: RootState) => state.koreografers.toEdit
  );
  const dispatch = useDispatch();

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (koreograferToEdit.id && !state)
      dispatch(setKoreograferToEditRedux(koreograferInitialValue));
  };

  useEffect(() => {
    if (koreograferToEdit.id) setOpen(true);
  }, [koreograferToEdit]);

  return (
    <Dialog onOpenChange={(state) => toggleDialog(state)} open={open}>
      <DialogTrigger asChild>
        <Button disabled={editOnly}>Tambah Official</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[100vw] max-h-screen overflow-auto">
        <KoreograferForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
export default KoreograferDialog;
