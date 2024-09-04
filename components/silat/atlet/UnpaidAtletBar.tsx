import { AtletState, biayaAtlet } from "@/utils/silat/atlet/atletConstants";
import AtletPaymentDialog from "./AtletPaymentDialog";
import { Row } from "@tanstack/react-table";

const UnpaidAtletBar = (props: any) => {
  const { rows, selectedRows } = props;
  return (
    <div className="flex justify-between items-center w-full mt-1">
      <p className="text-sm text-muted-foreground">
        {selectedRows.length}/{rows.length} terpilih.
      </p>
      <p className="text-lg">
        Total Biaya:{" "}
        <b>Rp {(selectedRows.length * biayaAtlet).toLocaleString("id")}</b>
      </p>
      <AtletPaymentDialog
        selectedAtlets={selectedRows.map(
          (row: Row<AtletState>) => row.original
        )}
      />
    </div>
  );
};
export default UnpaidAtletBar;
