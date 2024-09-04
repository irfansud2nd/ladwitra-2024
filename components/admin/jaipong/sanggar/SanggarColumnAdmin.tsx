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
import Link from "next/link";
import { SanggarState } from "@/utils/jaipong/sanggar/sanggarConstants";

export const SanggarColumnAdmin: ColumnDef<SanggarState>[] = [
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
    id: "Penari",
    accessorKey: "penaris.length",
    header: "Penari",
    cell: ({ row }) => <div>{row.original.penaris.length}</div>,
  },
  {
    id: "Nomor Tarian",
    header: "Nomor Tarian",
    accessorKey: "nomorTarian",
  },
  {
    id: "Koreografer",
    accessorKey: "koreografers.length",
    header: "Koreografer",
    cell: ({ row }) => <div>{row.original.koreografers.length}</div>,
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
      const sanggar = row.original;
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
              <DropdownMenuItem asChild>
                <Link href={`/admin/jaipong/sanggar/${sanggar.id}`}>
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

export const DetailSanggarColumnAdmin = SanggarColumnAdmin.filter(
  (item) => item.id != "No" && item.id != "Nama" && item.id != "Aksi"
);
