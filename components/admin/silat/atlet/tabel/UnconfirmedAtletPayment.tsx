"use client";
import { UnconfirmedColumn } from "@/components/admin/payment/UnconfirmedColumn";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import { toastFirebaseError } from "@/utils/functions";
import { setPaymentsRedux } from "@/utils/redux/silat/paymentsSlice";
import { RootState } from "@/utils/redux/store";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const UnconfirmedAtletPayment = () => {
  const data = useSelector((state: RootState) => state.payments.unconfirmed);
  const dispatch = useDispatch();

  const getData = () => {
    console.log("getUnconfirmedAtletPayment");
    axios
      .get("/api/payments/unconfirmed")
      .then((res) => dispatch(setPaymentsRedux(res.data.result)))
      .catch((error) => toastFirebaseError(error));
  };

  useEffect(() => {
    if (!data.length) getData();
  }, []);
  return <AdminTable columns={UnconfirmedColumn} data={data} />;
};

export default UnconfirmedAtletPayment;
