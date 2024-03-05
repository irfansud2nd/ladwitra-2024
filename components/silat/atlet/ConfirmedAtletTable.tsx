"use client";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { PaidAtletColumn } from "./PaidAtletColumn";
import { getAtletPaymentId } from "@/utils/silat/atlet/atletFunctions";

const ConfirmedAtletTable = () => {
  const registeredAtlets = useSelector(
    (state: RootState) => state.atlets.registered
  );
  const confirmedPayments = useSelector(
    (state: RootState) => state.payments.confirmed
  );
  const confirmedAtlets = registeredAtlets.filter((atlet) =>
    confirmedPayments.find((payment) => payment.id == getAtletPaymentId(atlet))
  );
  return <DataTable columns={PaidAtletColumn} data={confirmedAtlets} />;
};
export default ConfirmedAtletTable;
