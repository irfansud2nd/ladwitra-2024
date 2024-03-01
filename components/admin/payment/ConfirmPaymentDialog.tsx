"use client";
import {
  PaymentState,
  paymentInitialValue,
} from "@/utils/payment/paymentConstants";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ConfirmPaymentForm from "./ConfirmPaymentForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { setPaymentToConfirmRedux } from "@/utils/redux/silat/paymentsSlice";

const ConfirmPaymentDialog = () => {
  const [open, setOpen] = useState(false);
  const paymentToConfirm = useSelector(
    (state: RootState) => state.payments.toConfirm
  );
  const dispatch = useDispatch();
  const toggle = (state: boolean) => {
    setOpen(state);
    if (!state && paymentToConfirm.id) {
      dispatch(setPaymentToConfirmRedux(paymentInitialValue));
    }
  };
  useEffect(() => {
    console.log(paymentToConfirm);
    setOpen(paymentToConfirm.id != "");
  }, [paymentToConfirm]);

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent>
        <ConfirmPaymentForm payment={paymentToConfirm} />
      </DialogContent>
    </Dialog>
  );
};
export default ConfirmPaymentDialog;
