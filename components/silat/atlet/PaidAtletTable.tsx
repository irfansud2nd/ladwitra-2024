"use client";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { getAtletPaymentId } from "@/utils/silat/atlet/atletFunctions";
import { PaidAtletColumn } from "./UnpaidAtletColumn";

const PaidAtletTable = ({ confirmed }: { confirmed?: boolean }) => {
  const registeredAtlets = useSelector(
    (state: RootState) => state.atlets.registered
  );
  const { unconfirmed: unconfirmedPayments, confirmed: confirmedPayments } =
    useSelector((state: RootState) => state.payments);
  const unconfirmedAtlets = registeredAtlets.filter((atlet) =>
    unconfirmedPayments.find(
      (payment) => payment.id == getAtletPaymentId(atlet)
    )
  );
  const confirmedAtlets = registeredAtlets.filter((atlet) =>
    confirmedPayments.find((payment) => payment.id == getAtletPaymentId(atlet))
  );
  return (
    <DataTable
      columns={PaidAtletColumn}
      data={confirmed ? confirmedAtlets : unconfirmedAtlets}
    />
  );
};
export default PaidAtletTable;
