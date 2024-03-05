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
import { PaymentState } from "@/utils/payment/paymentConstants";
import { formatDate, formatToRupiah } from "@/utils/functions";
import { useDispatch } from "react-redux";
import { setPaymentToConfirmRedux } from "@/utils/redux/silat/paymentsSlice";

export const UnconfirmedColumn: ColumnDef<PaymentState>[] = [
  {
    id: "No",
    header: "No",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    id: "ID Pembayaran",
    header: "ID Pembayaran",
    accessorKey: "id",
  },
  {
    id: "Total Pembayaran",
    accessorKey: "totalPembayaran",
    header: "Jumlah Transaksi",
    cell: ({ row }) => (
      <div>{formatToRupiah(row.original.totalPembayaran)}</div>
    ),
  },
  {
    id: "Email",
    header: "Email",
    accessorKey: "creatorEmail",
  },
  {
    id: "No Hp",
    header: "No Hp",
    accessorKey: "noHp",
  },
  {
    id: "Waktu Pembayaran",
    header: "Waktu Pembayaran",
    accessorKey: "waktuPembayaran",
    cell: ({ row }) => <div>{formatDate(row.original.waktuPembayaran)}</div>,
  },
  {
    id: "Aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const payment = row.original;
      const dispatch = useDispatch();

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
              onClick={() => dispatch(setPaymentToConfirmRedux(payment))}
            >
              Konfirmasi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
