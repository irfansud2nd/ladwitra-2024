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
import { PaymentState } from "@/utils/payment/paymentConstants";

const ConfirmedPaymentTable = ({ source }: { source: "silat" | "jaipong" }) => {
  const [page, setPage] = useState(1);
  const [highestPage, setHighestPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const [limit, setLimit] = useState(itemPerPage);

  const data = useSelector((state: RootState) => state.payments.confirmed)
    .filter((payment) => payment.source == source)
    .slice((page - 1) * itemPerPage, page * itemPerPage);
  const dispatch = useDispatch();

  const getData = (time: number, exception?: PaymentState[]) => {
    //  console.log(
    //   "getConfirmedPayment",
    //   source,
    //   page,
    //   (page - 1) * itemPerPage,
    //   page * itemPerPage
    // );
    setLoading(true);

    let url = `/api/payments?status=confirmed&source=${source}&timestamp=${time}&limit=${limit}`;
    if (exception?.length)
      url += `&exception=${exception.map((item) => item.waktuPembayaran)}`;

    axios
      // .get(`/api/payments/confirmed/${source}/${time}`)
      .get(url)
      .then((res) => dispatch(addPaymentsRedux(res.data.result)))
      .catch((error) => toastFirebaseError(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (page == 1) {
      data.length ? getData(Date.now(), data) : getData(Date.now());
    }
  }, []);

  useEffect(() => {
    if (page > highestPage) {
      data.length ? getData(timestamp, data) : getData(timestamp);
      setHighestPage(page);
    }
  }, [page]);

  useEffect(() => {
    if (data.length) setTimestamp(data[data.length - 1].waktuPembayaran);
  }, [data]);

  useEffect(() => {
    if (limit > itemPerPage) getData(timestamp);
  }, [limit]);

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
        showAll={() => setLimit(1000)}
        downloadable
      />
    </>
  );
};

export default ConfirmedPaymentTable;
