"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
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
import { PenariState } from "@/utils/jaipong/penari/penariConstants";
import {
  getPenariLagu,
  getPenariNamaTim,
  getTarianId,
} from "@/utils/jaipong/penari/penariFunctions";
import TarianCell from "./TarianCell";

export const PenariColumnAdmin: ColumnDef<PenariState>[] = [
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
  // {
  //   id: "NIK",
  //   header: "NIK",
  //   accessorKey: "NIK",
  //   cell: ({ row }) => (
  //     <div>
  //       <span className="hidden">'</span>
  //       {row.original.NIK}
  //       <span className="hidden">'</span>
  //     </div>
  //   ),
  // },
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
    cell: ({ row }) => (
      <div>{formatDate(row.original.lahir.tanggal, true)}</div>
    ),
  },
  {
    id: "Alamat Lengkap",
    header: "Alamat Lengkap",
    accessorKey: "alamatLengkap",
  },
  {
    id: "Tarian",
    header: "Tarian",
    accessorKey: "tarian",
    cell: ({ row }) => <TarianCell penari={row.original} />,
  },
  {
    id: "Pembayaran",
    header: "Pembayaran",
    accessorKey: "pembayaran",
    cell: ({ row }) => {
      const tarian = row.original.tarian;
      const pembayaran = row.original.pembayaran;
      if (!pembayaran.length && tarian.length > 0)
        return <div className="text-destructive">Belum Dibayar</div>;
      if (pembayaran.length < tarian.length)
        return <div className="text-yellow-500">Belum Lunas</div>;
      if (pembayaran.length == tarian.length)
        return <div className="text-green-500">Lunas</div>;
    },
  },
  {
    id: "Nama Sanggar",
    header: "Nama Sanggar",
    accessorKey: "namaSanggar",
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
      const penari = row.original;
      const { showFile, ShowFileDialog } = useShowFileDialog();

      const handleClick = (tipe: "Pas Foto" | "KK" | "KTP") => {
        let url = "";
        let title = `${tipe} ${penari.nama}`;
        let landscape = false;
        switch (tipe) {
          case "Pas Foto":
            url = penari.foto.downloadUrl;
            break;
          // case "KK":
          //   url = penari.downloadKkUrl;
          //   landscape = true;
          //   break;
          // case "KTP":
          //   url = penari.downloadKtpUrl;
          //   landscape = true;
          //   break;
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
              {/* <DropdownMenuItem onClick={() => handleClick("KTP")}>
                KTP
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleClick("KK")}>
                Kartu Keluarga
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

// export const FilteredPenariColumnAdmin = PenariColumnAdmin.filter(
//   (item) => item.id != "tarian"
// );

export const FilteredPenariColumnAdmin = (idTarian: string) => {
  let column = PenariColumnAdmin;
  const index = column.findIndex((item) => item.id == "Tarian");
  column.splice(index, 1, {
    ...column[index],
    cell: ({ row }: { row: Row<PenariState> }) => (
      <TarianCell penari={row.original} idTarian={idTarian} />
    ),
  });
  return column;
};
