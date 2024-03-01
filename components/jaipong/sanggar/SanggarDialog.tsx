"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { setSanggarToEditRedux } from "@/utils/redux/jaipong/sanggarSlice";
import { sanggarInitialValue } from "@/utils/jaipong/sanggar/sanggarConstants";
import SanggarForm from "./SanggarForm";

const SanggarDialog = ({
  edit,
  children,
}: {
  edit?: boolean;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const sanggarToEdit = useSelector((state: RootState) => state.sanggar.toEdit);

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (sanggarToEdit.id && !state)
      dispatch(setSanggarToEditRedux(sanggarInitialValue));
  };

  return (
    <Dialog onOpenChange={(state) => toggleDialog(state)} open={open}>
      <DialogTrigger asChild>
        {edit ? children : <Button>Daftar Sanggar</Button>}
      </DialogTrigger>
      <DialogContent className="w-fit">
        <SanggarForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
export default SanggarDialog;
