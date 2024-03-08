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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import useConfirmationDialog from "@/hooks/UseAlertDialog";
import { KoreograferState } from "@/utils/jaipong/koreografer/koreograferConstants";
import { deleteKoreografer } from "@/utils/jaipong/koreografer/koreograferFunctions";
import { setKoreograferToEditRedux } from "@/utils/redux/jaipong/koreografersSlice";
import { editOnly } from "@/utils/constants";

export const KoreograferColumn: ColumnDef<KoreograferState>[] = [
  {
    header: "No",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },

  {
    accessorKey: "nama",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Nama" />;
    },
  },
  {
    accessorKey: "jenisKelamin",
    header: "Jenis Kelamin",
  },
  {
    accessorKey: "jabatan",
    header: "Jabatan",
  },
  {
    accessorKey: "waktuPendaftaran",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Waktu Pendaftaran" />;
    },
    cell: ({ row }) => <div>{formatDate(row.original.waktuPendaftaran)}</div>,
  },
  {
    header: "Aksi",
    id: "actions",
    cell: ({ row }) => {
      const koreografer = row.original;
      const dispatch = useDispatch();
      const sanggar = useSelector(
        (state: RootState) => state.sanggar.registered
      );

      const { confirm, ConfirmationDialog } = useConfirmationDialog();

      const handleDelete = async (koreografer: KoreograferState) => {
        const result = await confirm("Hapus Koreografer", "Apakah anda yakin?");
        result && deleteKoreografer(koreografer, dispatch, sanggar);
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
              <DropdownMenuItem
                onClick={() => dispatch(setKoreograferToEditRedux(koreografer))}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(koreografer)}
                className={`text-destructive ${editOnly && "hidden"}`}
              >
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
