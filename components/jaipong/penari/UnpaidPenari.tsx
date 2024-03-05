"use client";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { SelectableTable } from "../../utils/tabel/SelectableTable";
import { UnpaidPenariColumn } from "./UnpaidPenariColumn";
import UnpaidPenariBar from "./UnpaidPenariBar";
import { isPenariPaid } from "@/utils/jaipong/penari/penariFunctions";

const UnpaidPenari = () => {
  const unpaidPenaris = useSelector(
    (state: RootState) => state.penaris.registered
  ).filter((penari) => !isPenariPaid(penari));
  return (
    <SelectableTable columns={UnpaidPenariColumn} data={unpaidPenaris}>
      <UnpaidPenariBar />
    </SelectableTable>
  );
};
export default UnpaidPenari;
