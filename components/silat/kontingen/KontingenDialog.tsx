"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import KontingenForm from "./KontingenForm";
import { kontingenInitialValue } from "@/utils/silat/kontingen/kontingenConstants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { setKontingenToEditRedux } from "@/utils/redux/silat/kontingenSlice";

const KontingenDialog = ({
  edit,
  children,
}: {
  edit?: boolean;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const kontingenToEdit = useSelector(
    (state: RootState) => state.kontingen.toEdit
  );

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (kontingenToEdit.id && !state)
      dispatch(setKontingenToEditRedux(kontingenInitialValue));
  };

  useEffect(() => {
    if (kontingenToEdit.id) setOpen(true);
  }, [kontingenToEdit]);

  return (
    <Dialog onOpenChange={(state) => toggleDialog(state)} open={open}>
      <DialogTrigger asChild>
        <Button className={`${edit && "hidden"}`}>Daftar Kontingen</Button>
      </DialogTrigger>
      <DialogContent className="w-fit">
        <KontingenForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
export default KontingenDialog;
