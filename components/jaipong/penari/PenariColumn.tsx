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
import { PenariState } from "@/utils/jaipong/penari/penariConstants";
import { setPenariToEditRedux } from "@/utils/redux/jaipong/penarisSlice";
import {
  deletePenari,
  isPenariPaid,
} from "@/utils/jaipong/penari/penariFunctions";
import { closePendaftaran, editOnly } from "@/utils/constants";

let columns: ColumnDef<PenariState>[] = [
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
    accessorKey: "waktuPendaftaran",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Waktu Pendaftaran" />;
    },
    cell: ({ row }) => <div>{formatDate(row.original.waktuPendaftaran)}</div>,
  },
  {
    header: "Aksi",
    id: "Aksi",
    cell: ({ row }) => {
      const penari = row.original;
      const dispatch = useDispatch();
      const sanggar = useSelector(
        (state: RootState) => state.sanggar.registered
      );

      const { confirm, ConfirmationDialog } = useConfirmationDialog();

      const handleDelete = async (penari: PenariState) => {
        const paid = isPenariPaid(penari);
        const message = paid
          ? "Penari yang sudah dibayar tidak dapat dihapus."
          : "Apakah anda yakin?";
        const options = paid
          ? { cancelLabel: "Baik", cancelOnly: true }
          : undefined;
        const result = await confirm("Hapus Penari", message, options);
        result && deletePenari(penari, dispatch, sanggar);
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
                onClick={() => dispatch(setPenariToEditRedux(penari))}
              >
                Edit
              </DropdownMenuItem>
              {!editOnly && (
                <DropdownMenuItem
                  onClick={() => handleDelete(penari)}
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

export const PenariColumn = columns;
