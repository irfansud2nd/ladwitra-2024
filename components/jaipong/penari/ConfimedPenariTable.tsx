"use client";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { PaidPenariColumn } from "./PaidPenariColumn";

const ConfirmedPenariTable = () => {
  const registeredPenaris = useSelector(
    (state: RootState) => state.penaris.registered
  );
  const confirmedPayments = useSelector(
    (state: RootState) => state.payments.confirmed
  );
  const confirmedPenaris = registeredPenaris.filter((penari) =>
    confirmedPayments.find(
      (payment) => payment.id == penari.tarian[0].idPembayaran
    )
  );
  return <DataTable columns={PaidPenariColumn} data={confirmedPenaris} />;
};
export default ConfirmedPenariTable;
