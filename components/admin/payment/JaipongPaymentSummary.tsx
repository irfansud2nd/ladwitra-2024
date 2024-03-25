"use client";

import {
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CountFirestore from "@/components/utils/CountFirestore";
import {
  setCountJaipongPayment,
  setCountJaipongPaymentUnconfirmed,
} from "@/utils/redux/admin/countSlice";
import { RootState } from "@/utils/redux/store";
import { Dialog } from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";

const JaipongPaymentSummary = () => {
  const dispatch = useDispatch();
  const { jaipongPayment, jaipongPaymentUnconfirmed } = useSelector(
    (state: RootState) => state.count
  );
  return (
    <Dialog>
      <DialogTrigger>Summary</DialogTrigger>
      <DialogContent className="max-w-[90vw] w-fit">
        <DialogTitle className="text-center">Pembayaran Jaipong</DialogTitle>
        <div className="flex gap-2 max-sm:flex-col items-center w-fit">
          <CountFirestore
            title="Total Pembayaran"
            apiUrl="/api/payments/all/jaipong/count"
            onComplete={(result) => dispatch(setCountJaipongPayment(result))}
            count={jaipongPayment}
            money
          />
          <CountFirestore
            title="Menunggu Konfirmasi"
            apiUrl="/api/payments/unconfirmed/jaipong/count"
            onComplete={(result) =>
              dispatch(setCountJaipongPaymentUnconfirmed(result))
            }
            count={jaipongPaymentUnconfirmed}
            money
          />
          <CountFirestore
            title="Pembayaran Terkonfirmasi"
            count={jaipongPayment - jaipongPaymentUnconfirmed}
            disableRefresh
            money
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default JaipongPaymentSummary;
