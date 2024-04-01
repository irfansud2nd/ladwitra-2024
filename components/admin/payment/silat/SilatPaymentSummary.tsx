"use client";

import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CountFirestore from "@/components/utils/CountFirestore";
import {
  setCountSilatPayment,
  setCountSilatPaymentUnconfirmed,
} from "@/utils/redux/admin/countSlice";
import { RootState } from "@/utils/redux/store";
import { Dialog } from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";

const SilatPaymentSummary = () => {
  const dispatch = useDispatch();
  const { silatPayment, silatPaymentUnconfirmed } = useSelector(
    (state: RootState) => state.count
  );
  return (
    <Dialog>
      <DialogTrigger>Summary</DialogTrigger>
      <DialogContent className="flex gap-2 max-sm:flex-col items-center max-w-[90vw] w-fit">
        <CountFirestore
          title="Total Pembayaran"
          // apiUrl="/api/payments/all/silat/count"
          apiUrl="/api/payments?count=true&source=silat"
          onComplete={(result) => dispatch(setCountSilatPayment(result))}
          count={silatPayment}
          money
        />
        <CountFirestore
          title="Menunggu Konfirmasi"
          // apiUrl="/api/payments/unconfirmed/silat/count"
          apiUrl="/api/payments?count=true&source=silat&status=unconfirmed"
          onComplete={(result) =>
            dispatch(setCountSilatPaymentUnconfirmed(result))
          }
          count={silatPaymentUnconfirmed}
          money
        />
        <CountFirestore
          title="Pembayaran Terkonfirmasi"
          count={silatPayment - silatPaymentUnconfirmed}
          disableRefresh
          money
        />
      </DialogContent>
    </Dialog>
  );
};
export default SilatPaymentSummary;
