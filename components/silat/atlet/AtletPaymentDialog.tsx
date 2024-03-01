import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AtletPaymentForm from "./AtletPaymentForm";
import { AtletState } from "@/utils/silat/atlet/atletConstats";

const AtletPaymentDialog = ({
  selectedAtlets,
}: {
  selectedAtlets: AtletState[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!selectedAtlets.length}>Bayar</Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[100vw] max-h-screen overflow-auto">
        <AtletPaymentForm selectedAtlets={selectedAtlets} />
      </DialogContent>
    </Dialog>
  );
};
export default AtletPaymentDialog;
