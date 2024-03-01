import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PenariState } from "@/utils/jaipong/penari/penariConstants";
import PenariPaymentForm from "./PenariPaymentForm";

const PenariPaymentDialog = ({
  selectedPenaris,
}: {
  selectedPenaris: PenariState[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!selectedPenaris.length}>Bayar</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[100vw] max-h-screen overflow-auto">
        <PenariPaymentForm selectedPenaris={selectedPenaris} />
      </DialogContent>
    </Dialog>
  );
};
export default PenariPaymentDialog;
