import { PenariState } from "@/utils/jaipong/penari/penariConstants";
import { getBiayaPenaris } from "@/utils/jaipong/penari/penariFunctions";
import { Row } from "@tanstack/react-table";
import PenariPaymentDialog from "./PenariPaymentDialog";

const UnpaidPenariBar = (props: any) => {
  const { rows, selectedRows } = props;
  const selectedPenaris = selectedRows.map(
    (row: Row<PenariState>) => row.original
  );

  return (
    <div className="flex justify-between items-center w-full mt-1">
      <p className="text-sm text-muted-foreground">
        {selectedRows.length}/{rows.length} terpilih.
      </p>
      <p className="text-lg">
        Total Biaya:{" "}
        <b>Rp {getBiayaPenaris(selectedPenaris).toLocaleString("id")}</b>
      </p>
      <PenariPaymentDialog selectedPenaris={selectedPenaris} />
    </div>
  );
};
export default UnpaidPenariBar;
