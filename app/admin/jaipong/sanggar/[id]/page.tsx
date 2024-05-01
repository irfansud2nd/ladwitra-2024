"use client";

import { PenariColumnAdmin } from "@/components/admin/jaipong/penari/PenariColumnAdmin";
import { DetailSanggarColumnAdmin } from "@/components/admin/jaipong/sanggar/SanggarColumnAdmin";
import { KoreograferColumnAdmin } from "@/components/admin/jaipong/koreografer/KoreograferColumnAdmin";
import FullLoading from "@/components/loadings/FullLoading";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import { reduceData } from "@/utils/admin/adminFunctions";
import { toastFirebaseError } from "@/utils/functions";
import { addPenarisRedux } from "@/utils/redux/jaipong/penarisSlice";
import { RootState } from "@/utils/redux/store";
import { SanggarState } from "@/utils/jaipong/sanggar/sanggarConstants";
import { KoreograferState } from "@/utils/jaipong/koreografer/koreograferConstants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const page = ({ params }: { params: { id: string } }) => {
  const [sanggarLoading, setSanggarLoading] = useState(true);
  const [koreograferLoading, setKoreograferLoading] = useState(true);
  const [penariLoading, setPenariLoading] = useState(true);

  const idSanggar = params.id;

  const fetchedSanggar = useSelector(
    (state: RootState) => state.sanggar.all
  ).find((sanggar) => sanggar.id == idSanggar) as SanggarState;
  const [sanggar, setSanggar] = useState(fetchedSanggar);

  const fetchedKoreografers = useSelector(
    (state: RootState) => state.koreografers.all
  ).filter((koreografer) => koreografer.idSanggar == idSanggar);
  const [koreografers, setKoreografers] = useState(fetchedKoreografers);

  const penaris = useSelector((state: RootState) => state.penaris.all).filter(
    (penari) => penari.idSanggar == idSanggar
  );

  const dispatch = useDispatch();

  const getSanggar = () => {
    setSanggarLoading(true);
    axios
      .get(`/api/sanggars?id=${idSanggar}&limit=1`)
      .then((res) => {
        setSanggar(res.data.result[0]);
      })
      .catch((error) => toastFirebaseError(error))
      .finally(() => setSanggarLoading(false));
  };

  const getKoreografers = () => {
    setKoreograferLoading(true);
    axios
      .get(`/api/koreografers?idSanggar=${idSanggar}&limit=500`)
      .then((res) => {
        setKoreografers(
          reduceData([
            ...res.data.result,
            ...fetchedKoreografers,
          ]) as KoreograferState[]
        );
      })
      .catch((error) => toastFirebaseError(error))
      .finally(() => setKoreograferLoading(true));
  };

  const getPenaris = () => {
    setPenariLoading(true);
    axios
      .get(`/api/penaris?idSanggar=${idSanggar}&limit=500`)
      .then((res) => {
        dispatch(addPenarisRedux(res.data.result));
      })
      .catch((error) => toastFirebaseError(error))
      .finally(() => setPenariLoading(false));
  };

  useEffect(() => {
    if (sanggar?.id) {
      sanggar?.koreografers.length > fetchedKoreografers.length &&
      koreograferLoading
        ? getKoreografers()
        : setKoreograferLoading(false);

      sanggar?.penaris.length > penaris.length && penariLoading && sanggar?.id
        ? getPenaris()
        : setPenariLoading(false);
    }
  }, [sanggar]);

  useEffect(() => {
    !sanggar?.id && sanggarLoading ? getSanggar() : setSanggarLoading(false);
  }, []);

  if (!sanggar?.id) return <FullLoading />;

  return (
    <>
      <AdminTable
        title={`Sanggar ${sanggar.nama}`}
        columns={DetailSanggarColumnAdmin}
        data={[sanggar]}
        hFit
      />
      <AdminTable
        title="penari"
        columns={PenariColumnAdmin}
        data={penaris}
        hFit
        downloadable
        customFileName={`Penari ${sanggar.nama}`}
      />
      <AdminTable
        title="koreografer"
        columns={KoreograferColumnAdmin}
        data={koreografers}
        hFit
        downloadable
        customFileName={`Koreografer ${sanggar.nama}`}
      />
    </>
  );
};
export default page;
