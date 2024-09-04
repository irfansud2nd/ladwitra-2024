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
import { AtletState } from "@/utils/silat/atlet/atletConstants";
import TableSortButton from "@/components/utils/tabel/TableSortButton";
import { formatDate } from "@/utils/functions";
import { getPertandinganId } from "@/utils/silat/atlet/atletFunctions";
import useShowFileDialog from "@/hooks/UseShowFileDialog";

export const AtletColumnAdmin: ColumnDef<AtletState>[] = [
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
    id: "NIK",
    header: "NIK",
    accessorKey: "NIK",
    cell: ({ row }) => (
      <div>
        <span className="hidden">'</span>
        {row.original.NIK}
        <span className="hidden">'</span>
      </div>
    ),
  },
  {
    id: "Jenis Kelamin",
    header: "Jenis Kelamin",
    accessorKey: "jenisKelamin",
  },
  {
    id: "Tempat Lahir",
    header: "Tempat Lahir",
    accessorKey: "tempatLahir",
  },
  {
    id: "Tanggal Lahir",
    header: "Tanggal Lahir",
    cell: ({ row }) => <div>{formatDate(row.original.tanggalLahir, true)}</div>,
  },
  {
    id: "Alamat Lengkap",
    header: "Alamat Lengkap",
    accessorKey: "alamatLengkap",
  },
  {
    id: "Tinggi Badan",
    header: "Tinggi Badan",
    accessorKey: "tinggiBadan",
    cell: ({ row }) => <div>{row.original.tinggiBadan} CM</div>,
  },
  {
    id: "Berat Badan",
    header: "Berat Badan",
    accessorKey: "beratBadan",
    cell: ({ row }) => <div>{row.original.beratBadan} KG</div>,
  },
  {
    id: "Pertandingan",
    header: "Pertandingan",
    accessorKey: "pertandingan",
    cell: ({ row }) => (
      <div>
        {row.original.pertandingan.map((pertandingan, i) => (
          <p key={i}>
            <span>{getPertandinganId(pertandingan, true)}</span>
            <br />
          </p>
        ))}
      </div>
    ),
  },
  {
    id: "Pembayaran",
    header: "Pembayaran",
    accessorKey: "pembayaran",
    cell: ({ row }) => {
      const pertandingan = row.original.pertandingan;
      const pembayaran = row.original.pembayaran;
      if (!pembayaran.length)
        return <div className="text-destructive">Belum Dibayar</div>;
      if (pembayaran.length < pertandingan.length)
        return <div className="text-yellow-500">Belum Lunas</div>;
      if (pembayaran.length == pertandingan.length)
        return <div className="text-green-500">Lunas</div>;
    },
  },
  {
    id: "Nomor Pertandingan",
    header: "Nomor Pertandingan",
    accessorKey: "nomorPertandingan",
  },
  {
    id: "Nama Kontingen",
    header: "Nama Kontingen",
    accessorKey: "namaKontingen",
  },
  {
    id: "Email",
    header: "Email",
    accessorKey: "email",
  },
  {
    id: "No Hp",
    header: "No Hp",
    accessorKey: "noHp",
    cell: ({ row }) => (
      <div>
        <span className="hidden">'</span>
        {row.original.noHp}
        <span className="hidden">'</span>
      </div>
    ),
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
    header: "Aksi",
    id: "Aksi",
    cell: ({ row }) => {
      const atlet = row.original;
      const { showFile, ShowFileDialog } = useShowFileDialog();

      const handleClick = (tipe: "Pas Foto" | "KK" | "KTP") => {
        let url = "";
        let title = `${tipe} ${atlet.nama}`;
        let landscape = false;
        switch (tipe) {
          case "Pas Foto":
            url = atlet.downloadFotoUrl;
            break;
          case "KK":
            url = atlet.downloadKkUrl;
            landscape = true;
            break;
          case "KTP":
            url = atlet.downloadKtpUrl;
            landscape = true;
            break;
        }

        showFile(title, url, landscape);
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
              <DropdownMenuItem onClick={() => handleClick("Pas Foto")}>
                Pas Foto
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleClick("KTP")}>
                KTP
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleClick("KK")}>
                Kartu Keluarga
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export const FilteredAtletColumnAdmin = (idPertandingan: string) => {
  let column = AtletColumnAdmin;
  const index = column.findIndex((item) => item.id == "Pertandingan");
  column.splice(index, 1, {
    ...column[index],
    cell: () => <div>{idPertandingan.split("/").slice(0, -1).join(" - ")}</div>,
  });
  return column;
};
