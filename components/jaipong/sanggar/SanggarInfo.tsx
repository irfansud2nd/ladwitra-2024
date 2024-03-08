"use client";
import { Button } from "@/components/ui/button";
import { RootState } from "@/utils/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { IoMdMore } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdGroups } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import useConfirmationDialog from "@/hooks/UseAlertDialog";
import { setSanggarToEditRedux } from "@/utils/redux/jaipong/sanggarSlice";
import SanggarDialog from "./SanggarDialog";
import { deleteSanggar } from "@/utils/jaipong/sanggar/sanggarFunctions";

const SanggarInfo = ({ show }: { show: boolean }) => {
  const [open, setOpen] = useState(false);
  const sanggar = useSelector((state: RootState) => state.sanggar.registered);
  const sanggarToEdit = useSelector((state: RootState) => state.sanggar.toEdit);
  const koreografers = useSelector(
    (state: RootState) => state.koreografers.registered
  );
  const penaris = useSelector((state: RootState) => state.penaris.all);

  const dispatch = useDispatch();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  const handleDelete = async () => {
    let message = "";
    if (sanggar.idPembayaran.length) {
      message = "Sanggar yang sudah melakukan pembayaran tidak dapat dihapus.";
    } else {
      if (sanggar.penaris.length)
        message += `${sanggar.penaris.length} Penari akan ikut terhapus. `;
      message += "Apakah anda yakin?";
    }
    const options = sanggar.idPembayaran.length
      ? { cancelLabel: "Baik", cancelOnly: true }
      : undefined;
    const result = await confirm("Hapus Sanggar", message, options);
    result && deleteSanggar(sanggar, koreografers, penaris, dispatch);
  };

  return (
    <div className="border-b flex items-center justify-between">
      <SanggarDialog edit />
      <ConfirmationDialog />
      <p
        className={`font-semibold transition-all 
        ${show ? "text-lg" : "text-[0]"}`}
      >
        {sanggar.nama}
      </p>
      <DropdownMenu
        open={sanggarToEdit.id ? true : open}
        onOpenChange={setOpen}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="*:size-6">
                  {show ? <IoMdMore /> : <MdGroups />}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent className={`${show && "hidden"}`}>
              <p>Sanggar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent>
          {!show && <DropdownMenuLabel>{sanggar.nama}</DropdownMenuLabel>}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              dispatch(setSanggarToEditRedux(sanggar));
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive"
            onClick={() => handleDelete()}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default SanggarInfo;
