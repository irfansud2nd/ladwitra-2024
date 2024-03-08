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
import { AtletState } from "@/utils/silat/atlet/atletConstats";
import TableSortButton from "@/components/utils/tabel/TableSortButton";
import { formatDate } from "@/utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { setAtletToEditRedux } from "@/utils/redux/silat/atletsSlice";
import { deleteAtlet, isAtletPaid } from "@/utils/silat/atlet/atletFunctions";
import { RootState } from "@/utils/redux/store";
import useConfirmationDialog from "@/hooks/UseAlertDialog";
import { editOnly } from "@/utils/constants";

export const AtletColumn: ColumnDef<AtletState>[] = [
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
    accessorKey: "tinggiBadan",
    header: "Tinggi Badan",
    cell: ({ row }) => <div>{row.original.tinggiBadan} CM</div>,
  },
  {
    accessorKey: "beratBadan",
    header: "Berat Badan",
    cell: ({ row }) => <div>{row.original.beratBadan} KG</div>,
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
      const atlet = row.original;
      const dispatch = useDispatch();
      const kontingen = useSelector(
        (state: RootState) => state.kontingen.registered
      );

      const { confirm, ConfirmationDialog } = useConfirmationDialog();

      const handleDelete = async (atlet: AtletState) => {
        const paid = isAtletPaid(atlet);
        const message = paid
          ? "Atlet yang sudah dibayar tidak dapat dihapus."
          : "Apakah anda yakin?";
        const options = paid
          ? { cancelLabel: "Baik", cancelOnly: true }
          : undefined;
        const result = await confirm("Hapus Atlet", message, options);
        result && deleteAtlet(atlet, dispatch, kontingen);
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
                onClick={() => dispatch(setAtletToEditRedux(atlet))}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(atlet)}
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
