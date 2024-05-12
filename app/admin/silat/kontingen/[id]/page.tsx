"use client";

import { AtletColumnAdmin } from "@/components/admin/silat/atlet/AtletColumnAdmin";
import { DetailKontingenColumnAdmin } from "@/components/admin/silat/kontingen/KontingenColumnAdmin";
import { OfficialColumnAdmin } from "@/components/admin/silat/official/OfficialColumnAdmin";
import FullLoading from "@/components/loadings/FullLoading";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import { reduceData } from "@/utils/admin/adminFunctions";
import { toastFirebaseError } from "@/utils/functions";
import { addAtletsRedux } from "@/utils/redux/silat/atletsSlice";
import { RootState } from "@/utils/redux/store";
import { KontingenState } from "@/utils/silat/kontingen/kontingenConstants";
import { OfficialState } from "@/utils/silat/official/officialConstants";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const page = ({ params }: { params: { id: string } }) => {
  const [kontingenLoading, setKontingenLoading] = useState(true);
  const [officialLoading, setOfficialLoading] = useState(true);
  const [atletLoading, setAtletLoading] = useState(true);

  const idKontingen = params.id;

  const fetchedKontingen = useSelector(
    (state: RootState) => state.kontingen.all
  ).find((kontingen) => kontingen.id == idKontingen) as KontingenState;
  const [kontingen, setKontingen] = useState(fetchedKontingen);

  const fetchedOfficials = useSelector(
    (state: RootState) => state.officials.all
  ).filter((official) => official.kontingen.id == idKontingen);
  const [officials, setOfficials] = useState(fetchedOfficials);

  const atlets = useSelector((state: RootState) => state.atlets.all).filter(
    (atlet) => atlet.kontingen.id == idKontingen
  );

  const dispatch = useDispatch();

  const getKontingen = () => {
    setKontingenLoading(true);
    axios
      .get(`/api/kontingens?id=${idKontingen}&limit=1`)
      .then((res) => {
        setKontingen(res.data.result[0]);
      })
      .catch((error) => toastFirebaseError(error))
      .finally(() => setKontingenLoading(false));
  };

  const getOfficials = () => {
    setOfficialLoading(true);
    axios
      .get(`/api/officials?idKontingen=${idKontingen}&limit=500`)
      .then((res) => {
        setOfficials(
          reduceData([
            ...res.data.result,
            ...fetchedOfficials,
          ]) as OfficialState[]
        );
      })
      .catch((error) => toastFirebaseError(error))
      .finally(() => setOfficialLoading(true));
  };

  const getAtlets = () => {
    setAtletLoading(true);
    axios
      .get(`/api/atlets?idKontingen=${idKontingen}&limit=500`)
      .then((res) => {
        dispatch(addAtletsRedux(res.data.result));
      })
      .catch((error) => toastFirebaseError(error))
      .finally(() => setAtletLoading(false));
  };

  useEffect(() => {
    if (kontingen?.id) {
      kontingen?.officials.length > fetchedOfficials.length && officialLoading
        ? getOfficials()
        : setOfficialLoading(false);

      kontingen?.atlets.length > atlets.length && atletLoading && kontingen?.id
        ? getAtlets()
        : setAtletLoading(false);
    }
  }, [kontingen]);

  useEffect(() => {
    !kontingen?.id && kontingenLoading
      ? getKontingen()
      : setKontingenLoading(false);
  }, []);

  if (!kontingen?.id) return <FullLoading />;

  return (
    <>
      <AdminTable
        title={`Kontingen ${kontingen.nama}`}
        columns={DetailKontingenColumnAdmin}
        data={[kontingen]}
        hFit
      />
      <AdminTable
        title="atlet"
        columns={AtletColumnAdmin}
        data={atlets}
        hFit
        downloadable
        customFileName={`Atlet ${kontingen.nama}`}
      />
      <AdminTable
        title="official"
        columns={OfficialColumnAdmin}
        data={officials}
        hFit
        downloadable
        customFileName={`Official ${kontingen.nama}`}
      />
    </>
  );
};
export default page;
