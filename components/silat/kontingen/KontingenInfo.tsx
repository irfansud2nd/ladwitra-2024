"use client";
import { Badge } from "@/components/ui/badge";
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
import { setKontingenToEditRedux } from "@/utils/redux/silat/kontingenSlice";
import KontingenDialog from "./KontingenDialog";
import { useState } from "react";
import useConfirmationDialog from "@/hooks/UseAlertDialog";
import { deleteKontingen } from "@/utils/silat/kontingen/kontingenFunctions";

const KontingenInfo = ({ show }: { show: boolean }) => {
  const [open, setOpen] = useState(false);
  const kontingen = useSelector(
    (state: RootState) => state.kontingen.registered
  );
  const kontingenToEdit = useSelector(
    (state: RootState) => state.kontingen.toEdit
  );
  const officials = useSelector(
    (state: RootState) => state.officials.registered
  );
  const atlets = useSelector((state: RootState) => state.atlets.all);

  const dispatch = useDispatch();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  const handleDelete = async () => {
    let message = "";
    if (kontingen.idPembayaran.length) {
      message =
        "Kontingen yang sudah melakukan pembayaran tidak dapat dihapus.";
    } else {
      if (kontingen.atlets.length || kontingen.officials.length)
        message += `${kontingen.atlets.length} Atlet, dan ${kontingen.officials.length} Official akan ikut terhapus. `;
      message += "Apakah anda yakin?";
    }
    const options = kontingen.idPembayaran.length
      ? { cancelLabel: "Baik", cancelOnly: true }
      : undefined;
    const result = await confirm("Hapus Kontingen", message, options);
    result && deleteKontingen(kontingen, officials, atlets, dispatch);
  };

  if (!kontingen.id) return <></>;
  return (
    <div className="border-b flex items-center justify-between">
      <ConfirmationDialog />
      <p
        className={`font-semibold transition-all 
        ${show ? "text-lg" : "text-[0]"}`}
      >
        {kontingen.nama}
      </p>
      <DropdownMenu
        open={kontingenToEdit.id ? true : open}
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
              <p>Kontingen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent>
          {!show && <DropdownMenuLabel>{kontingen.nama}</DropdownMenuLabel>}
          <KontingenDialog edit>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                dispatch(setKontingenToEditRedux(kontingen));
              }}
            >
              Edit
            </DropdownMenuItem>
          </KontingenDialog>
          <DropdownMenuSeparator />
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
export default KontingenInfo;
