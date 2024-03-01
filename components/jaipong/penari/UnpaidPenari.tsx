"use client";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { SelectableTable } from "../../utils/tabel/SelectableTable";
import { UnpaidPenariColumn } from "./UnpaidPenariColumn";
import UnpaidPenariBar from "./UnpaidPenariBar";

const UnpaidPenari = () => {
  const unpaidPenaris = useSelector(
    (state: RootState) => state.penaris.registered
  ).filter((penari) => !penari.tarian[0].idPembayaran);
  return (
    <SelectableTable columns={UnpaidPenariColumn} data={unpaidPenaris}>
      <UnpaidPenariBar />
    </SelectableTable>
  );
};
export default UnpaidPenari;
