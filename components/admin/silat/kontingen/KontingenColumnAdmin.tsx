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
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { KontingenState } from "@/utils/silat/kontingen/kontingenConstants";
import Link from "next/link";

export const KontingenColumnAdmin: ColumnDef<KontingenState>[] = [
  {
    id: "No",
    header: "No",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },

  {
    id: "Nama",
    accessorKey: "nama",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Nama" />;
    },
  },
  {
    id: "Atlet",
    accessorKey: "atlets.length",
    header: "Atlet",
    cell: ({ row }) => <div>{row.original.atlets.length}</div>,
  },
  {
    id: "Nomor Pertandingan",
    header: "Nomor Pertandingan",
    accessorKey: "nomorPertandingan",
  },
  {
    id: "Official",
    accessorKey: "officials.length",
    header: "Official",
    cell: ({ row }) => <div>{row.original.officials.length}</div>,
  },
  {
    id: "Pembayaran",
    accessorKey: "totalPembayaran",
    header: "Pembayaran",
    cell: ({ row }) => {
      const { totalPembayaran, tagihan } = row.original;
      if (totalPembayaran == 0 && tagihan > 0)
        return <div className="text-red-500">Belum dibayar</div>;
      if (totalPembayaran < tagihan)
        return <div className="text-yellow-500">Belum lunas</div>;
      if (totalPembayaran >= tagihan) {
        return <div className="text-green-500">Lunas</div>;
      }
    },
  },
  {
    id: "Email Pendaftar",
    header: "Email Pendaftar",
    accessorKey: "creatorEmail",
  },
  {
    id: "Waktu Pendaftaran",
    accessorKey: "waktuPendaftaran",
    header: ({ column }) => {
      return <TableSortButton column={column} text="Waktu Pendaftaran" />;
    },
    cell: ({ row }) => <div>{formatDate(row.original.waktuPendaftaran)}</div>,
  },
  {
    id: "Aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const kontingen = row.original;
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <FiMoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/admin/silat/kontingen/${kontingen.id}`}>
                  Detail
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
