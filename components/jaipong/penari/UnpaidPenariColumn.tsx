"use client";

import { ColumnDef } from "@tanstack/react-table";
import TableSortButton from "@/components/utils/tabel/TableSortButton";
import { Checkbox } from "@/components/ui/checkbox";
import { PenariState } from "@/utils/jaipong/penari/penariConstants";
import {
  getPenariLagu,
  getPenariNamaTim,
  getPenariPaymentId,
} from "@/utils/jaipong/penari/penariFunctions";
import PaidPesertaButton from "@/components/utils/PaidPesertaButton";

export const UnpaidPenariColumn: ColumnDef<PenariState>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nama",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Nama" />;
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
    accessorKey: "tarian[0].jenis",
    header: "Jenis",
    cell: ({ row }) => {
      const penari = row.original;
      return <div>{penari.tarian[0].jenis}</div>;
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
    accessorKey: "tarian[0].namaTim",
    header: "Nama Tim",
    cell: ({ row }) => {
      const penari = row.original;
      return <div>{getPenariNamaTim(penari) || "-"}</div>;
    },
  },
  {
    accessorKey: "tarian[0].lagu",
    header: "Lagu",
    cell: ({ row }) => {
      const penari = row.original;
      return <div>{getPenariLagu(penari) || "-"}</div>;
    },
  },
  {
    header: "Biaya",
    id: "biaya",
    cell: ({ row }) => {
      const penari = row.original;
      return (
        <div>
          Rp {penari.tarian[0].jenis == "Tunggal" ? "200.000" : "350.000"}
        </div>
      );
    },
  },
];

export const PaidPenariColumn = [
  ...UnpaidPenariColumn.filter(
    (item) => item.id != "select" && item.id != "biaya"
  ),
  {
    header: "Aksi",
    id: "actions",
    cell: ({ row }: { row: any }) => (
      <PaidPesertaButton idPembayaran={getPenariPaymentId(row.original)} />
    ),
  },
];
