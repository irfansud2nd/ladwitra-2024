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
import { PenariState } from "@/utils/jaipong/penari/penariConstants";

export const PaidPenariColumn: ColumnDef<PenariState>[] = [
  {
    accessorKey: "nama",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Nama" />;
    },
  },
  {
    accessorKey: "tarian",
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
    header: "Aksi",
    id: "actions",
    cell: ({ row }) => {
      const penari = row.original;

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
                navigator.clipboard.writeText(penari.tarian[0].idPembayaran)
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
