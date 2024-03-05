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
import { getAtletPaymentId } from "@/utils/silat/atlet/atletFunctions";

export const PaidAtletColumn: ColumnDef<AtletState>[] = [
  {
    accessorKey: "nama",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Nama" />;
    },
  },
  {
    accessorKey: "pertandingan",
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
    header: "Aksi",
    id: "actions",
    cell: ({ row }) => {
      const atlet = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <FiMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(getAtletPaymentId(atlet))
              }
            >
              Salin ID pembayaran
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
