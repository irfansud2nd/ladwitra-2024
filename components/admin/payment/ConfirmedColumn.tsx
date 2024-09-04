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
import ConfirmPaymentDialog from "./ConfirmPaymentDialog";
import { useDispatch } from "react-redux";
import { setPaymentToConfirmRedux } from "@/utils/redux/silat/paymentsSlice";

export const ConfirmedColumn: ColumnDef<PaymentState>[] = [
  {
    header: "No",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    id: "id",
    accessorKey: "id",
    header: "ID Pembayaran",
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
    accessorKey: "creatorEmail",
    header: "Email",
  },
  {
    accessorKey: "noHp",
    header: "No Hp",
  },
  {
    accessorKey: "waktuPembayaran",
    header: "Waktu Pembayaran",
    cell: ({ row }) => <div>{formatDate(row.original.waktuPembayaran)}</div>,
  },
  {
    header: "Aksi",
    id: "Aksi",
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
              Info Konfirmasi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
