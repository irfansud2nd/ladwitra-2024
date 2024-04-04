"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toastFirebaseError } from "@/utils/functions";
import PersonLoading from "../loadings/PersonLoading";
import { RootState } from "@/utils/redux/store";
import {
  addPaymentsRedux,
  setPaymentsRedux,
} from "@/utils/redux/silat/paymentsSlice";
import { setKoreografersRedux } from "@/utils/redux/jaipong/koreografersSlice";
import { setSanggarRedux } from "@/utils/redux/jaipong/sanggarSlice";
import { setPenarisRedux } from "@/utils/redux/jaipong/penarisSlice";
import SanggarNotFound from "./sanggar/SanggarNotFound";
import { checkLimit } from "@/utils/constants";
import { setCountNomorTarian } from "@/utils/redux/admin/countSlice";

const GetUserJaipongData = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(0);
  const dispatch = useDispatch();
  const session = useSession();

  const sanggar = useSelector((state: RootState) => state.sanggar.registered);

  const getSanggar = () => {
    // console.log("getSanggar");
    const email = session.data?.user?.email as string;
    axios
      // .get(`/api/sanggars/${email}`)
      .get(`/api/sanggars?email=${email}`)
      .then((res) => {
        dispatch(setSanggarRedux(res.data.result[0]));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getKoreografers = () => {
    // console.log("getKoreografers");
    const email = session.data?.user?.email as string;
    axios
      // .get(`/api/koreografers/${email}`)
      .get(`/api/koreografers?email=${email}`)
      .then((res) => {
        dispatch(setKoreografersRedux(res.data.result));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getPenaris = () => {
    // console.log("getPenaris");
    const email = session.data?.user?.email as string;
    axios
      // .get(`/api/penaris/${email}`)
      .get(`/api/penaris?email=${email}`)
      .then((res) => {
        dispatch(setPenarisRedux(res.data.result));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getPayments = () => {
    // console.log("getPayments");
    const email = session.data?.user?.email as string;
    axios
      // .get(`/api/payments/all/jaipong/${email}`)
      .get(`/api/payments?source=jaipong&email=${email}`)
      .then((res) => {
        dispatch(addPaymentsRedux(res.data.result));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getLimit = () => {
    console.log("getLimit Silat");
    axios.get("/api/penaris?count=true&registered=true").then((res) => {
      dispatch(setCountNomorTarian(res.data.result));
      setLoading((prev) => prev + 1);
    });
  };

  const getAll = () => {
    getSanggar();
    getPenaris();
    getKoreografers();
    getPayments();
    if (checkLimit) getLimit();
  };

  const loadingLimit = checkLimit ? 5 : 4;

  useEffect(() => {
    if (loading < loadingLimit)
      if (!sanggar?.id) {
        getAll();
      } else {
        setLoading((prev) => prev + 4);
        checkLimit && getLimit();
      }
  }, [sanggar]);

  if (loading < 4) return <PersonLoading />;

  if (!sanggar?.id) return <SanggarNotFound />;

  return children;
};
export default GetUserJaipongData;
