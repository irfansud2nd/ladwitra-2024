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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdGroups } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  deleteKontingenRedux,
  setKontingenToEditRedux,
} from "@/utils/redux/silat/kontingenSlice";
import KontingenDialog from "./KontingenDialog";
import useConfirmationDialog from "@/hooks/UseAlertDialog";
import { deleteKontingen } from "@/utils/silat/kontingen/kontingenFunctions";
import { closePendaftaran, editOnly } from "@/utils/constants";
import { setAtletsRedux } from "@/utils/redux/silat/atletsSlice";
import { setOfficialsRedux } from "@/utils/redux/silat/officialsSlice";

const KontingenInfo = ({ show }: { show: boolean }) => {
  const kontingen = useSelector(
    (state: RootState) => state.kontingen.registered
  );
  const officials = useSelector(
    (state: RootState) => state.officials.registered
  );
  const atlets = useSelector((state: RootState) => state.atlets.all);

  const dispatch = useDispatch();
  const { confirm, ConfirmationDialog } = useConfirmationDialog();

  const handleDelete = async () => {
    let message = "";
    if (kontingen.pembayaran.ids.length) {
      message =
        "Kontingen yang sudah melakukan pembayaran tidak dapat dihapus.";
    } else {
      if (kontingen.atlets.length || kontingen.officials.length)
        message += `${kontingen.atlets.length} Atlet, dan ${kontingen.officials.length} Official akan ikut terhapus. `;
      message += "Apakah anda yakin?";
    }
    const options = kontingen.pembayaran.ids.length
      ? { cancelLabel: "Baik", cancelOnly: true }
      : undefined;
    const result = await confirm("Hapus Kontingen", message, options);
    result && (await deleteKontingen(kontingen, officials, atlets));
    dispatch(deleteKontingenRedux());
    dispatch(setAtletsRedux([]));
    dispatch(setOfficialsRedux([]));
  };

  return (
    <div className="border-b flex items-center justify-between">
      <KontingenDialog edit />
      <ConfirmationDialog />
      <p
        className={`font-semibold transition-all 
        ${show ? "text-lg" : "text-[0]"}`}
      >
        {kontingen.nama}
      </p>
      <DropdownMenu>
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
          {!closePendaftaran && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                dispatch(setKontingenToEditRedux(kontingen));
              }}
            >
              Edit
            </DropdownMenuItem>
          )}
          {(!closePendaftaran || !editOnly) && (
            <DropdownMenuItem
              className={`cursor-pointer text-destructive 
            ${editOnly && "hidden"}`}
              onClick={() => handleDelete()}
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default KontingenInfo;
