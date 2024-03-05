"use client";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { PaidAtletColumn } from "./PaidAtletColumn";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { getAtletPaymentId } from "@/utils/silat/atlet/atletFunctions";

const UnconfirmedAtletTable = () => {
  const registeredAtlets = useSelector(
    (state: RootState) => state.atlets.registered
  );
  const unconfirmedPayments = useSelector(
    (state: RootState) => state.payments.unconfirmed
  );
  const unconfirmedAtlets = registeredAtlets.filter((atlet) =>
    unconfirmedPayments.find(
      (payment) => payment.id == getAtletPaymentId(atlet)
    )
  );
  return <DataTable columns={PaidAtletColumn} data={unconfirmedAtlets} />;
};
export default UnconfirmedAtletTable;
