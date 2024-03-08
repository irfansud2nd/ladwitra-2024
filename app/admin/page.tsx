"use client";
import { Card, CardTitle } from "@/components/ui/card";
import CountFirestore from "@/components/utils/CountFirestore";
import {
  setCountAtlet,
  setCountKontingen,
  setCountKoreografer,
  setCountNomorPertandingan,
  setCountNomorTarian,
  setCountOfficial,
  setCountPayment,
  setCountPaymentUnconfirmed,
  setCountPenari,
  setCountSanggar,
} from "@/utils/redux/admin/countSlice";
import { RootState } from "@/utils/redux/store";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
  const {
    kontingen,
    official,
    atlet,
    nomorPertandingan,
    sanggar,
    koreografer,
    penari,
    nomorTarian,
    payment,
    paymentUnconfirmed,
    paymentConfirmed,
  } = useSelector((state: RootState) => state.count);

  const dispatch = useDispatch();

  return (
    <div className="flex flex-col w-full h-full sm:justify-around items-center">
      <Card className="flex flex-col items-center gap-y-2 p-2">
        <CardTitle className="text-lg font-bold">Silat</CardTitle>
        <div className="flex flex-wrap justify-around gap-1">
          <CountFirestore
            title="Kontingen"
            apiUrl="/api/kontingens/count"
            onComplete={(value) => dispatch(setCountKontingen(value))}
            count={kontingen}
          />
          <CountFirestore
            title="Official"
            apiUrl="/api/officials/count"
            onComplete={(value) => dispatch(setCountOfficial(value))}
            count={official}
          />
          <CountFirestore
            title="Atlet"
            apiUrl="/api/atlets/count"
            onComplete={(value) => dispatch(setCountAtlet(value))}
            count={atlet}
          />
          <CountFirestore
            title="Nomor Pertandingan"
            apiUrl="/api/atlets/count/registered"
            count={nomorPertandingan}
            onComplete={(value) => dispatch(setCountNomorPertandingan(value))}
          />
        </div>
      </Card>
      <Card className="flex flex-col items-center gap-y-2 p-2">
        <CardTitle className="text-lg font-bold">Jaipong</CardTitle>
        <div className="flex flex-wrap justify-around gap-1">
          <CountFirestore
            title="Sanggar"
            apiUrl="/api/sanggars/count"
            onComplete={(value) => dispatch(setCountSanggar(value))}
            count={sanggar}
          />
          <CountFirestore
            title="Koreografer"
            apiUrl="/api/koreografers/count"
            onComplete={(value) => dispatch(setCountKoreografer(value))}
            count={koreografer}
          />
          <CountFirestore
            title="Penari"
            apiUrl="/api/penaris/count"
            onComplete={(value) => dispatch(setCountPenari(value))}
            count={penari}
          />
          <CountFirestore
            title="Nomor Tarian"
            apiUrl="/api/penaris/count/registered"
            count={nomorTarian}
            onComplete={(value) => dispatch(setCountNomorTarian(value))}
          />
        </div>
      </Card>
      <Card className="flex flex-col items-center gap-y-2 p-2">
        <CardTitle className="text-lg font-bold">Pembayaran</CardTitle>
        <div className="flex flex-wrap justify-around gap-1">
          <CountFirestore
            title="Total Payment"
            apiUrl="/api/payments/all/count"
            count={payment}
            onComplete={(value) => dispatch(setCountPayment(value))}
            money
          />
          <CountFirestore
            title="Confirmed Payment"
            count={paymentConfirmed}
            disableRefresh
            money
          />
          <CountFirestore
            title="Unconfirmed Payment"
            apiUrl="/api/payments/unconfirmed/count"
            count={paymentUnconfirmed}
            onComplete={(value) => dispatch(setCountPaymentUnconfirmed(value))}
            money
          />
        </div>
      </Card>
    </div>
  );
};
export default page;
