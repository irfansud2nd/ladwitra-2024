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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import useConfirmationDialog from "@/hooks/UseAlertDialog";
import { useState } from "react";
import { PenariState } from "@/utils/jaipong/penari/penariConstants";
import { updatePenari } from "@/utils/jaipong/penari/penariFunctions";

export const RegisteredPenariColumn: ColumnDef<PenariState>[] = [
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
    accessorKey: "tarian[0].tingkatan",
    header: "Tingkatan",
    cell: ({ row }) => {
      const penari = row.original;
      return <div>{penari.tarian[0].tingkatan}</div>;
    },
  },
  {
    accessorKey: "tarian[0].kategori",
    header: "Kategori",
    cell: ({ row }) => {
      const penari = row.original;
      return <div>{penari.tarian[0].kategori}</div>;
    },
  },
  {
    id: "namaTim",
    accessorKey: "tarian[0].namaTim",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Nama Tim" />;
    },
    cell: ({ row }) => {
      const penari = row.original;
      return <div>{penari.tarian[0].namaTim}</div>;
    },
  },
  {
    header: "Aksi",
    id: "actions",
    cell: ({ row }) => {
      const [loading, setLoading] = useState(false);
      const penari = row.original;
      const dispatch = useDispatch();
      const allPenaris = useSelector((state: RootState) => state.penaris.all);

      const { confirm, ConfirmationDialog } = useConfirmationDialog();

      const handleDelete = async (penariToDelete: PenariState) => {
        const message = penari.tarian[0].idPembayaran
          ? "Penari yang sudah dibayar tidak dapat dihapus."
          : "Apakah anda yakin?";
        const options = penari.tarian[0].idPembayaran
          ? { cancelLabel: "Baik", cancelOnly: true }
          : undefined;
        const result = await confirm(
          "Hapus penari dari kategori tarian",
          message,
          options
        );
        if (result) {
          const penari = allPenaris.find(
            (penari) => penari.id == penariToDelete.id
          ) as PenariState;
          const newTarian = [...penari.tarian].filter(
            (item) => item != penariToDelete.tarian[0]
          );
          const newPenari: PenariState = {
            ...penari,
            tarian: newTarian,
            nomorTarian: penari.nomorTarian - 1,
          };
          updatePenari(newPenari, dispatch, setLoading);
        }
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
                onClick={() => handleDelete(penari)}
                className="text-destructive"
                disabled={loading}
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
