"use client";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { SelectableTable } from "../../utils/tabel/SelectableTable";
import { PaymentPenariColumn } from "./PaymentPenariColumn";
import UnpaidPenariBar from "./UnpaidPenariBar";
import { isPenariPaid } from "@/utils/jaipong/penari/penariFunctions";
import { closePayment } from "@/utils/constants";

const UnpaidPenari = () => {
  const unpaidPenaris = useSelector(
    (state: RootState) => state.penaris.registered
  ).filter((penari) => !isPenariPaid(penari, true));
  return (
    <SelectableTable columns={PaymentPenariColumn()} data={unpaidPenaris}>
      {closePayment ? (
        <p className="w-full text-center text-destructive font-semibold text-lg">
          Pembayaran telah ditutup
        </p>
      ) : (
        <UnpaidPenariBar />
      )}
    </SelectableTable>
  );
};
export default UnpaidPenari;
