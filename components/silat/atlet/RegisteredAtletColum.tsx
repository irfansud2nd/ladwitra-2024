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
import { AtletState, biayaAtlet } from "@/utils/silat/atlet/atletConstats";
import TableSortButton from "@/components/utils/tabel/TableSortButton";
import { useDispatch, useSelector } from "react-redux";
import { isAtletPaid, updateAtlet } from "@/utils/silat/atlet/atletFunctions";
import { RootState } from "@/utils/redux/store";
import useConfirmationDialog from "@/hooks/UseAlertDialog";
import { useState } from "react";
import { KontingenState } from "@/utils/silat/kontingen/kontingenConstants";
import { updateKontingen } from "@/utils/silat/kontingen/kontingenFunctions";

export const RegisteredAtletColumn: ColumnDef<AtletState>[] = [
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
    accessorKey: "pertandingan[0].tingkatan",
    header: "Tingkatan",
    cell: ({ row }) => {
      const atlet = row.original;
      return <div>{atlet.pertandingan[0].tingkatan}</div>;
    },
  },
  {
    accessorKey: "pertandingan[0].kategori",
    header: "Kategori",
    cell: ({ row }) => {
      const atlet = row.original;
      return <div>{atlet.pertandingan[0].kategori}</div>;
    },
  },
  {
    header: "Aksi",
    id: "actions",
    cell: ({ row }) => {
      const [loading, setLoading] = useState(false);
      const atlet = row.original;
      const dispatch = useDispatch();
      const allAtlets = useSelector((state: RootState) => state.atlets.all);
      const kontingen = useSelector(
        (state: RootState) => state.kontingen.registered
      );

      const { confirm, ConfirmationDialog } = useConfirmationDialog();

      const handleDelete = async (atletToDelete: AtletState) => {
        const message = isAtletPaid(atlet)
          ? "Atlet yang sudah dibayar tidak dapat dihapus."
          : "Apakah anda yakin?";
        const options = isAtletPaid(atlet)
          ? { cancelLabel: "Baik", cancelOnly: true }
          : undefined;
        const result = await confirm(
          "Hapus atlet dari kategori pertandingan",
          message,
          options
        );
        if (result) {
          const atlet = allAtlets.find(
            (atlet) => atlet.id == atletToDelete.id
          ) as AtletState;
          const newPertandingan = [...atlet.pertandingan].filter(
            (item) => item != atletToDelete.pertandingan[0]
          );
          const newAtlet: AtletState = {
            ...atlet,
            pertandingan: newPertandingan,
            nomorPertandingan: atlet.nomorPertandingan - 1,
          };
          updateAtlet(newAtlet, dispatch, {
            setSubmitting: setLoading,
            onComplete: () => {
              setLoading(true);
              const newKontingen: KontingenState = {
                ...kontingen,
                tagihan: kontingen.tagihan - biayaAtlet,
                nomorPertandingan: kontingen.nomorPertandingan - 1,
              };
              updateKontingen(newKontingen, kontingen, dispatch, {
                setSubmitting: setLoading,
              });
            },
          });
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
                onClick={() => handleDelete(atlet)}
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
