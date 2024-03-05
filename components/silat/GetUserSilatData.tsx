"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import axios from "axios";
import { setKontingenRedux } from "@/utils/redux/silat/kontingenSlice";
import { toastFirebaseError } from "@/utils/functions";
import PersonLoading from "../loadings/PersonLoading";
import { setOfficialsRedux } from "@/utils/redux/silat/officialsSlice";
import { setAtletsRedux } from "@/utils/redux/silat/atletsSlice";
import { RootState } from "@/utils/redux/store";
import KontingenNotFound from "./kontingen/KontingenNotFound";
import { addPaymentsRedux } from "@/utils/redux/silat/paymentsSlice";

const GetUserSilatData = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(0);
  const dispatch = useDispatch();
  const session = useSession();

  const kontingen = useSelector(
    (state: RootState) => state.kontingen.registered
  );

  const getKontingen = () => {
    console.log("getKontingen");
    const email = session.data?.user?.email as string;
    axios
      .get(`/api/kontingens/${email}`)
      .then((res) => {
        dispatch(setKontingenRedux(res.data.result[0]));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getOfficials = () => {
    console.log("getOfficials");
    const email = session.data?.user?.email as string;
    axios
      .get(`/api/officials/${email}`)
      .then((res) => {
        dispatch(setOfficialsRedux(res.data.result));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getAtlets = () => {
    console.log("getAtlets");
    const email = session.data?.user?.email as string;
    axios
      .get(`/api/atlets/${email}`)
      .then((res) => {
        dispatch(setAtletsRedux(res.data.result));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getPayments = () => {
    console.log("getPayments");
    const email = session.data?.user?.email as string;
    axios
      .get(`/api/payments/all/silat/${email}`)
      .then((res) => {
        dispatch(addPaymentsRedux(res.data.result));
        setLoading((prev) => prev + 1);
      })
      .catch((error) => toastFirebaseError(error));
  };

  const getAll = () => {
    getKontingen();
    getAtlets();
    getOfficials();
    getPayments();
  };

  useEffect(() => {
    if (loading < 4) !kontingen?.id ? getAll() : setLoading(4);
  }, [kontingen]);

  if (loading < 4) return <PersonLoading />;

  if (!kontingen?.id) return <KontingenNotFound />;

  return children;
};
export default GetUserSilatData;
