"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AtletForm from "./AtletForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { setAtletToEditRedux } from "@/utils/redux/silat/atletsSlice";
import { atletInitialValue } from "@/utils/silat/atlet/atletConstats";

const AtletDialog = () => {
  const [open, setOpen] = useState(false);
  const atletToEdit = useSelector((state: RootState) => state.atlets.toEdit);
  const dispatch = useDispatch();

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (atletToEdit.id && !state)
      dispatch(setAtletToEditRedux(atletInitialValue));
  };

  useEffect(() => {
    if (atletToEdit.id) setOpen(true);
  }, [atletToEdit]);

  return (
    <Dialog onOpenChange={(state) => toggleDialog(state)} open={open}>
      <DialogTrigger asChild>
        <Button>Tambah Atlet</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[100vw] max-h-[90vh] overflow-auto pb-2">
        <AtletForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
export default AtletDialog;
