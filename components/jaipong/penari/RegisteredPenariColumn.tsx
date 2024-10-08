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
import {
  PenariState,
  biayaPenari,
} from "@/utils/jaipong/penari/penariConstants";
import {
  getPenariLagu,
  getPenariNamaTim,
  isPenariPaid,
  updatePenari,
} from "@/utils/jaipong/penari/penariFunctions";
import { SanggarState } from "@/utils/jaipong/sanggar/sanggarConstants";
import { updateSanggar } from "@/utils/jaipong/sanggar/sanggarFunctions";
import { editOnly, closePendaftaran } from "@/utils/constants";
import {
  setTarianToEditRedux,
  updatePenariRedux,
} from "@/utils/redux/jaipong/penarisSlice";
import { updateSanggarRedux } from "@/utils/redux/jaipong/sanggarSlice";

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
    accessorKey: "tarian[0].kelas",
    header: "Kelas",
    cell: ({ row }) => {
      const penari = row.original;
      return <div>{penari.tarian[0].kelas}</div>;
    },
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
      return <div>{getPenariNamaTim(penari)}</div>;
    },
  },
  {
    id: "lagu",
    accessorKey: "tarian[0].lagu",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Lagu" />;
    },
    cell: ({ row }) => {
      const penari = row.original;
      return <div>{getPenariLagu(penari)}</div>;
    },
  },
  {
    header: "Aksi",
    id: "Aksi",
    cell: ({ row }) => {
      const [loading, setLoading] = useState(false);
      const registeredPenari = row.original;
      const dispatch = useDispatch();

      const { all: allPenaris } = useSelector(
        (state: RootState) => state.penaris
      );
      const { registered: sanggar } = useSelector(
        (state: RootState) => state.sanggar
      );
      const { confirm, ConfirmationDialog } = useConfirmationDialog();

      const handleDelete = async () => {
        const message = isPenariPaid(registeredPenari, true)
          ? "Penari yang sudah dibayar tidak dapat dihapus."
          : "Apakah anda yakin?";
        const options = isPenariPaid(registeredPenari, true)
          ? { cancelLabel: "Baik", cancelOnly: true }
          : undefined;
        const result = await confirm(
          "Hapus penari dari kategori tarian",
          message,
          options
        );
        if (result) {
          const penari = allPenaris.find(
            (penari) => penari.id == registeredPenari.id
          ) as PenariState;

          const tarian = registeredPenari.tarian[0];
          const tarianIndex = penari.tarian.findIndex(
            (item) =>
              item.jenis == tarian.jenis &&
              item.kelas == tarian.kelas &&
              item.tingkatan == tarian.tingkatan &&
              item.kategori == tarian.kategori
          );
          let newTarian = [...penari.tarian];
          newTarian.splice(tarianIndex, 1);

          const lagu = registeredPenari.lagu[0];
          const newLagu = [...penari.lagu].filter((item) => item != lagu);

          const namaTim = registeredPenari.namaTim[0];
          const newNamaTim = [...penari.namaTim].filter(
            (item) => item != namaTim
          );

          const newPenari: PenariState = {
            ...penari,
            tarian: newTarian,
            namaTim: newNamaTim,
            lagu: newLagu,
            nomorTarian: penari.nomorTarian - 1,
          };

          try {
            setLoading(true);

            const biaya =
              penari.tarian[0].jenis == "Rampak"
                ? biayaPenari.rampak
                : biayaPenari.tunggal;
            let newSanggar: SanggarState = { ...sanggar };
            newSanggar.tagihan -= biaya;
            newSanggar.nomorTarian -= 1;

            const updatedPenari = await updatePenari(newPenari);
            const { sanggar: updatedSanggar } = await updateSanggar(
              newSanggar,
              sanggar
            );
            dispatch(updatePenariRedux(updatedPenari));
            dispatch(updateSanggarRedux(updatedSanggar));
          } finally {
            setLoading(false);
          }
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
              {/* <DropdownMenuItem
                onClick={() => dispatch(setTarianToEditRedux(registeredPenari))}
                disabled={loading}
              >
                Edit
              </DropdownMenuItem> */}
              {!editOnly && (
                <DropdownMenuItem
                  onClick={() => handleDelete()}
                  className={`text-destructive`}
                  disabled={loading}
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

export const RegisteredPenariColumn = (tipe: "Tunggal" | "Rampak") => {
  let result = columns;
  if (tipe == "Tunggal") result = result.filter((item) => item.id != "namaTim");
  if (tipe == "Rampak") result = result.filter((item) => item.id != "lagu");
  if (closePendaftaran) result = result.filter((item) => item.id !== "Aksi");

  return result;
};
