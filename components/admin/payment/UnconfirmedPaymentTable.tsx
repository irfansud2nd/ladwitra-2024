"use client";
import { UnconfirmedColumn } from "@/components/admin/payment/UnconfirmedColumn";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import { toastFirebaseError } from "@/utils/functions";
import { addPaymentsRedux } from "@/utils/redux/silat/paymentsSlice";
import { RootState } from "@/utils/redux/store";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmPaymentDialog from "./ConfirmPaymentDialog";

const UnconfirmedPaymentTable = ({
  source,
}: {
  source: "silat" | "jaipong";
}) => {
  const data = useSelector(
    (state: RootState) => state.payments.unconfirmed
  ).filter((payment) => payment.source == "silat");
  const dispatch = useDispatch();

  const getData = () => {
    console.log("getUnconfirmedPayment", source);
    axios
      .get(`/api/payments/unconfirmed/${source}`)
      .then((res) => dispatch(addPaymentsRedux(res.data.result)))
      .catch((error) => toastFirebaseError(error));
  };

  useEffect(() => {
    if (!data.length) getData();
  }, []);

  return (
    <>
      <ConfirmPaymentDialog />
      <AdminTable
        columns={UnconfirmedColumn}
        data={data}
        title={`pembayaran ${source} - menunggu konfirmasi`}
      />
    </>
  );
};

export default UnconfirmedPaymentTable;
