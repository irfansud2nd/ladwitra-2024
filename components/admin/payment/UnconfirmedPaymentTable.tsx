"use client";
import { UnconfirmedColumn } from "@/components/admin/payment/UnconfirmedColumn";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import { toastFirebaseError } from "@/utils/functions";
import { addPaymentsRedux } from "@/utils/redux/silat/paymentsSlice";
import { RootState } from "@/utils/redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPaymentDialog from "./ConfirmPaymentDialog";

const UnconfirmedPaymentTable = ({
  source,
}: {
  source: "silat" | "jaipong";
}) => {
  const [loading, setLoading] = useState(true);

  const data = useSelector(
    (state: RootState) => state.payments.unconfirmed
  ).filter((payment) => payment.source == source);
  const dispatch = useDispatch();

  const getData = () => {
    // console.log("getUnconfirmedPayment", source);
    setLoading(true);
    axios
      // .get(`/api/payments/unconfirmed/${source}`)
      .get(`/api/payments?source=${source}&status=unconfirmed`)
      .then((res) => dispatch(addPaymentsRedux(res.data.result)))
      .catch((error) => toastFirebaseError(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    data.length ? setLoading(false) : getData();
  }, []);

  return (
    <>
      <ConfirmPaymentDialog />
      <AdminTable
        columns={UnconfirmedColumn}
        data={data}
        title={`pembayaran ${source} - menunggu konfirmasi`}
        loading={loading}
        refresh={getData}
      />
    </>
  );
};

export default UnconfirmedPaymentTable;
