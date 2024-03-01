"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toastFirebaseError } from "@/utils/functions";
import PersonLoading from "../loadings/PersonLoading";
import { RootState } from "@/utils/redux/store";
import { setPaymentsRedux } from "@/utils/redux/silat/paymentsSlice";
import { setKoreografersRedux } from "@/utils/redux/jaipong/koreografersSlice";
import { setSanggarRedux } from "@/utils/redux/jaipong/sanggarSlice";
import { setPenarisRedux } from "@/utils/redux/jaipong/penarisSlice";
import SanggarNotFound from "./sanggar/SanggarNotFound";

const GetUserJaipongData = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(0);
  const dispatch = useDispatch();
  const session = useSession();

  const sanggar = useSelector((state: RootState) => state.sanggar.registered);
  const penaris = useSelector((state: RootState) => state.penaris.registered);
  const koreografers = useSelector(
    (state: RootState) => state.koreografers.registered
  );
  const payments = useSelector((state: RootState) => state.payments.all);

  const getSanggar = () => {
    console.log("getSanggar");
    const email = session.data?.user?.email as string;
    axios
      .get(`/api/sanggars/${email}`)
      .then((res) => {
        dispatch(setSanggarRedux(res.data.container[0]));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getKoreografers = () => {
    console.log("getKoreografers");
    const email = session.data?.user?.email as string;
    axios
      .get(`/api/koreografers/${email}`)
      .then((res) => {
        dispatch(setKoreografersRedux(res.data.container));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getPenaris = () => {
    console.log("getPenaris");
    const email = session.data?.user?.email as string;
    axios
      .get(`/api/penaris/${email}`)
      .then((res) => {
        dispatch(setPenarisRedux(res.data.container));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getPayments = () => {
    console.log("getPayments");
    const email = session.data?.user?.email as string;
    axios
      .get(`/api/payments/${email}`)
      .then((res) => {
        dispatch(setPaymentsRedux(res.data.container));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getAll = () => {
    getSanggar();
    getPenaris();
    getKoreografers();
    getPayments();
  };

  useEffect(() => {
    if (loading < 4) !sanggar?.id ? getAll() : setLoading(4);
  }, [sanggar]);

  if (loading < 4) return <PersonLoading />;

  if (!sanggar?.id) return <SanggarNotFound />;

  return children;
};
export default GetUserJaipongData;
