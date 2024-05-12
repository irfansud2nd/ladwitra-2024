"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FiMoreHorizontal } from "react-icons/fi";
import TableSortButton from "@/components/utils/tabel/TableSortButton";
import { formatDate } from "@/utils/functions";
import { OfficialState } from "@/utils/silat/official/officialConstants";
import { setOfficialToEditRedux } from "@/utils/redux/silat/officialsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import useConfirmationDialog from "@/hooks/UseAlertDialog";
import { deleteOfficial } from "@/utils/silat/official/officialFunctions";
import { closePendaftaran, editOnly } from "@/utils/constants";
import { updateKontingenRedux } from "@/utils/redux/silat/kontingenSlice";

let columns: ColumnDef<OfficialState>[] = [
  {
    id: "No",
    header: "No",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },

  {
    id: "Nama",
    accessorKey: "nama",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Nama" />;
    },
  },
  {
    id: "Jenis Kelamin",
    header: "Jenis Kelamin",
    accessorKey: "jenisKelamin",
  },
  {
    id: "Jabatan",
    header: "Jabatan",
    accessorKey: "jabatan",
  },
  {
    id: "Waktu Pendaftaran",
    accessorKey: "waktuPendaftaran",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Waktu Pendaftaran" />;
    },
    cell: ({ row }) => <div>{formatDate(row.original.waktuPendaftaran)}</div>,
  },
  {
    id: "Aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const official = row.original;
      const dispatch = useDispatch();
      const kontingen = useSelector(
        (state: RootState) => state.kontingen.registered
      );

      const { confirm, ConfirmationDialog } = useConfirmationDialog();

      const handleDelete = async (official: OfficialState) => {
        const result = await confirm("Hapus Official", "Apakah anda yakin?");
        result &&
          deleteOfficial(official, kontingen).then(
            (kontingen) =>
              kontingen && dispatch(updateKontingenRedux(kontingen))
          );
      };
      return (
        <>
          <ConfirmationDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <FiMoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!closePendaftaran && (
                <DropdownMenuItem
                  onClick={() => dispatch(setOfficialToEditRedux(official))}
                >
                  Edit
                </DropdownMenuItem>
              )}
              {(!editOnly || !closePendaftaran) && (
                <DropdownMenuItem
                  onClick={() => handleDelete(official)}
                  className={`text-destructive ${editOnly && "hidden"}`}
                >
                  Hapus
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

if (closePendaftaran) {
  columns = columns.filter((item) => item.id !== "Aksi");
}

export const OfficialColumn = columns;
