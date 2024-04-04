import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PenariState } from "@/utils/jaipong/penari/penariConstants";
import PenariPaymentForm from "./PenariPaymentForm";
import { useState } from "react";

const PenariPaymentDialog = ({
  selectedPenaris,
}: {
  selectedPenaris: PenariState[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={!selectedPenaris.length}>Bayar</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[100vw] max-h-screen overflow-auto">
        <PenariPaymentForm
          selectedPenaris={selectedPenaris}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
export default PenariPaymentDialog;
