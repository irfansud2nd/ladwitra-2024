import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AtletPaymentForm from "./AtletPaymentForm";
import { AtletState } from "@/utils/silat/atlet/atletConstants";
import { useState } from "react";

const AtletPaymentDialog = ({
  selectedAtlets,
}: {
  selectedAtlets: AtletState[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={!selectedAtlets.length}>Bayar</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[100vw] max-h-screen overflow-auto">
        <AtletPaymentForm selectedAtlets={selectedAtlets} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
export default AtletPaymentDialog;
