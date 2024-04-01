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
  } = useSelector((state: RootState) => state.count);

  const dispatch = useDispatch();

  return (
    <div className="flex flex-col w-full h-full sm:justify-around items-center">
      <Card className="flex flex-col items-center gap-y-2 p-2">
        <CardTitle className="text-lg font-bold">Silat</CardTitle>
        <div className="flex flex-wrap justify-around gap-1">
          <CountFirestore
            title="Kontingen"
            // apiUrl="/api/kontingens/count"
            apiUrl="/api/kontingens?count=true"
            link="/admin/silat/kontingen"
            onComplete={(value) => dispatch(setCountKontingen(value))}
            count={kontingen}
          />
          <CountFirestore
            title="Official"
            // apiUrl="/api/officials/count"
            apiUrl="/api/officials?count=true"
            link="/admin/silat/official"
            onComplete={(value) => dispatch(setCountOfficial(value))}
            count={official}
          />
          <CountFirestore
            title="Atlet"
            // apiUrl="/api/atlets/count"
            apiUrl="/api/atlets?count=true"
            link="/admin/silat/atlet"
            onComplete={(value) => dispatch(setCountAtlet(value))}
            count={atlet}
          />
          <CountFirestore
            title="Nomor Pertandingan"
            // apiUrl="/api/atlets/count/registered"
            apiUrl="/api/atlets?count=true&registered=true"
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
            // apiUrl="/api/sanggars/count"
            apiUrl="/api/sanggars?count=true"
            link="/admin/jaipong/sanggar"
            onComplete={(value) => dispatch(setCountSanggar(value))}
            count={sanggar}
          />
          <CountFirestore
            title="Koreografer"
            // apiUrl="/api/koreografers/count"
            apiUrl="/api/koreografers?count=true"
            link="/admin/jaipong/koreografer"
            onComplete={(value) => dispatch(setCountKoreografer(value))}
            count={koreografer}
          />
          <CountFirestore
            title="Penari"
            // apiUrl="/api/penaris/count"
            apiUrl="/api/penaris?count=true"
            link="/admin/jaipong/penari"
            onComplete={(value) => dispatch(setCountPenari(value))}
            count={penari}
          />
          <CountFirestore
            title="Nomor Tarian"
            // apiUrl="/api/penaris/count/registered"
            apiUrl="/api/penaris?count=true&registered=true"
            count={nomorTarian}
            onComplete={(value) => dispatch(setCountNomorTarian(value))}
          />
        </div>
      </Card>
      <Card className="flex flex-col items-center gap-y-2 p-2">
        <CardTitle className="text-lg font-bold">Pembayaran</CardTitle>
        <div className="flex flex-wrap justify-around gap-1">
          <CountFirestore
            title="Total Pembayaran"
            // apiUrl="/api/payments/all/count"
            apiUrl="/api/payments?count=true"
            count={payment}
            onComplete={(value) => dispatch(setCountPayment(value))}
            money
          />
          <CountFirestore
            title="Menunggu Konfirmasi"
            // apiUrl="/api/payments/unconfirmed/count"
            apiUrl="/api/payments?count=true&status=unconfirmed"
            count={paymentUnconfirmed}
            onComplete={(value) => dispatch(setCountPaymentUnconfirmed(value))}
            money
          />
          <CountFirestore
            title="Pembayaran Terkonfirmasi"
            count={payment - paymentUnconfirmed}
            disableRefresh
            money
          />
        </div>
      </Card>
    </div>
  );
};
export default page;
