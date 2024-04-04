"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import OfficialForm from "./OfficialForm";
import { useDispatch, useSelector } from "react-redux";
import { setOfficialToEditRedux } from "@/utils/redux/silat/officialsSlice";
import { officialInitialValue } from "@/utils/silat/official/officialConstants";
import { RootState } from "@/utils/redux/store";
import { closePendaftaran, editOnly } from "@/utils/constants";

const OfficialDialog = () => {
  const [open, setOpen] = useState(false);
  const officialToEdit = useSelector(
    (state: RootState) => state.officials.toEdit
  );
  const dispatch = useDispatch();

  const disableAdd = editOnly || closePendaftaran;

  const toggleDialog = (state: boolean) => {
    setOpen(state);
    if (officialToEdit.id && !state)
      dispatch(setOfficialToEditRedux(officialInitialValue));
  };

  useEffect(() => {
    if (officialToEdit.id) setOpen(true);
  }, [officialToEdit]);

  return (
    <Dialog onOpenChange={(state) => toggleDialog(state)} open={open}>
      {!disableAdd && (
        <DialogTrigger asChild>
          <Button>Tambah Official</Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-fit max-w-[100vw] max-h-screen overflow-auto">
        <OfficialForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
export default OfficialDialog;
