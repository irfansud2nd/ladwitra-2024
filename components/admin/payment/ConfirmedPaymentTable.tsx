"use client";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import { toastFirebaseError } from "@/utils/functions";
import { addPaymentsRedux } from "@/utils/redux/silat/paymentsSlice";
import { RootState } from "@/utils/redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmedColumn } from "./ConfirmedColumn";
import { itemPerPage } from "@/utils/constants";
import ConfirmPaymentDialog from "./ConfirmPaymentDialog";

const ConfirmedPaymentTable = ({ source }: { source: "silat" | "jaipong" }) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(0);

  const data = useSelector((state: RootState) => state.payments.confirmed)
    .filter((payment) => payment.source == "silat")
    .slice((page - 1) * itemPerPage, page * itemPerPage);
  const dispatch = useDispatch();

  const getData = (time: number) => {
    //  console.log(
    //   "getConfirmedPayment",
    //   source,
    //   page,
    //   (page - 1) * itemPerPage,
    //   page * itemPerPage
    // );
    setLoading(true);
    axios
      .get(`/api/payments/confirmed/${source}/${time}`)
      .then((res) => dispatch(addPaymentsRedux(res.data.result)))
      .catch((error) => toastFirebaseError(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!data.length && page == 1) getData(Date.now());
  }, []);

  useEffect(() => {
    if (page > 1 && !data.length) getData(timestamp);
  }, [page]);

  useEffect(() => {
    if (data.length) setTimestamp(data[data.length - 1].waktuPembayaran);
  }, [data]);

  return (
    <>
      <ConfirmPaymentDialog />
      <AdminTable
        columns={ConfirmedColumn}
        data={data}
        title={`pembayaran ${source} - sudah dikonfirmasi`}
        page={page}
        nextPage={() => setPage((prev) => prev + 1)}
        prevPage={() => setPage((prev) => prev - 1)}
        disablePrevPage={page == 1}
        disableNextPage={data.length < itemPerPage}
        loading={loading}
      />
    </>
  );
};

export default ConfirmedPaymentTable;
