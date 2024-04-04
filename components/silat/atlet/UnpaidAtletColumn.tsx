"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AtletState } from "@/utils/silat/atlet/atletConstats";
import TableSortButton from "@/components/utils/tabel/TableSortButton";
import { Checkbox } from "@/components/ui/checkbox";
import { getAtletPaymentId } from "@/utils/silat/atlet/atletFunctions";
import PaidPesertaButton from "@/components/utils/PaidPesertaButton";

export const UnpaidAtletColumn: ColumnDef<AtletState>[] = [
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
    accessorKey: "pertandingan[0].tingkatan",
    header: "Tingkatan",
    cell: ({ row }) => {
      const atlet = row.original;
      return <div>{atlet.pertandingan[0].tingkatan}</div>;
    },
  },
  {
    accessorKey: "pertandingan[0].jenis",
    header: "Jenis",
    cell: ({ row }) => {
      const atlet = row.original;
      return <div>{atlet.pertandingan[0].jenis}</div>;
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
    header: "Biaya",
    id: "biaya",
    cell: () => <div>Rp. 300.000</div>,
  },
];

export const PaidAtletColumn = [
  ...UnpaidAtletColumn.filter(
    (item) => item.id != "select" && item.id != "biaya"
  ),
  {
    header: "Aksi",
    id: "actions",
    cell: ({ row }: { row: any }) => (
      <PaidPesertaButton idPembayaran={getAtletPaymentId(row.original)} />
    ),
  },
];
