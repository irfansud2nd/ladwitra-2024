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
import useShowFileDialog from "@/hooks/UseShowFileDialog";
import { KoreograferState } from "@/utils/jaipong/koreografer/koreograferConstants";

export const KoreograferColumnAdmin: ColumnDef<KoreograferState>[] = [
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
    id: "Jenis Kelamin",
    header: "Jenis Kelamin",
    accessorKey: "jenisKelamin",
  },
  {
    id: "Jabatan",
    header: "Jabatan",
    accessorKey: "jabatan",
  },
  {
    id: "Nama sanggar",
    header: "Nama sanggar",
    accessorKey: "namasanggar",
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
      const koreografer = row.original;
      const { showFile, ShowFileDialog } = useShowFileDialog();

      const handleClick = () => {
        showFile(`Pas Foto ${koreografer.nama}`, koreografer.downloadFotoUrl);
      };
      return (
        <>
          <ShowFileDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <FiMoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleClick}>
                Pas Foto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
