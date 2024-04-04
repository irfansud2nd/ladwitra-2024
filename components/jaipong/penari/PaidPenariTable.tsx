"use client";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { PaidPenariColumn } from "./UnpaidPenariColumn";
import { getPenariPaymentId } from "@/utils/jaipong/penari/penariFunctions";

const PaidPenariTable = ({ confirmed }: { confirmed?: boolean }) => {
  const registeredPenaris = useSelector(
    (state: RootState) => state.penaris.registered
  );
  const { unconfirmed: unconfirmedPayments, confirmed: confirmedPayments } =
    useSelector((state: RootState) => state.payments);
  const unconfirmedPenaris = registeredPenaris.filter((penari) =>
    unconfirmedPayments.find(
      (payment) => payment.id == getPenariPaymentId(penari)
    )
  );
  const confirmedPenaris = registeredPenaris.filter((penari) =>
    confirmedPayments.find(
      (payment) => payment.id == getPenariPaymentId(penari)
    )
  );
  return (
    <DataTable
      columns={PaidPenariColumn}
      data={confirmed ? confirmedPenaris : unconfirmedPenaris}
    />
  );
};
export default PaidPenariTable;
