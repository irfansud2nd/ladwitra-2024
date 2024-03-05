"use client";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { PaidPenariColumn } from "./PaidPenariColumn";
import { getPenariPaymentId } from "@/utils/jaipong/penari/penariFunctions";

const UnconfirmedPenariTable = () => {
  const registeredPenaris = useSelector(
    (state: RootState) => state.penaris.registered
  );
  const unconfirmedPayments = useSelector(
    (state: RootState) => state.payments.unconfirmed
  );
  const unconfirmedPenaris = registeredPenaris.filter((penari) =>
    unconfirmedPayments.find(
      (payment) => payment.id == getPenariPaymentId(penari)
    )
  );
  return <DataTable columns={PaidPenariColumn} data={unconfirmedPenaris} />;
};
export default UnconfirmedPenariTable;