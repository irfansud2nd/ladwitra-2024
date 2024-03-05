"use client";
import { RootState } from "@/utils/redux/store";
import { UnpaidAtletColumn } from "./UnpaidAtletColumn";
import { useSelector } from "react-redux";
import { SelectableTable } from "../../utils/tabel/SelectableTable";
import UnpaidAtletBar from "./UnpaidAtletBar";
import { isAtletPaid } from "@/utils/silat/atlet/atletFunctions";

const UnpaidAtlet = () => {
  const unpaidAtlets = useSelector(
    (state: RootState) => state.atlets.registered
  ).filter((atlet) => !isAtletPaid(atlet));
  return (
    <SelectableTable columns={UnpaidAtletColumn} data={unpaidAtlets}>
      <UnpaidAtletBar />
    </SelectableTable>
  );
};
export default UnpaidAtlet;