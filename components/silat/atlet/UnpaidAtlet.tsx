"use client";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { SelectableTable } from "../../utils/tabel/SelectableTable";
import UnpaidAtletBar from "./UnpaidAtletBar";
import { isAtletPaid } from "@/utils/silat/atlet/atletFunctions";
import { closePayment } from "@/utils/constants";
import { PaymentAtletColumn } from "./PaymentAtletColumn";

const UnpaidAtlet = () => {
  const unpaidAtlets = useSelector(
    (state: RootState) => state.atlets.registered
  ).filter((atlet) => !isAtletPaid(atlet));
  return (
    <SelectableTable columns={PaymentAtletColumn()} data={unpaidAtlets}>
      {closePayment ? (
        <p className="w-full text-center text-destructive font-semibold text-lg">
          Pembayaran telah ditutup
        </p>
      ) : (
        <UnpaidAtletBar />
      )}
    </SelectableTable>
  );
};
export default UnpaidAtlet;
