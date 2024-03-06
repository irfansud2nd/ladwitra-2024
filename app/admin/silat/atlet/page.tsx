"use client";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemPerPage } from "@/utils/constants";
import { RootState } from "@/utils/redux/store";
import axios from "axios";
import { toastFirebaseError } from "@/utils/functions";
import { addAtletsRedux } from "@/utils/redux/silat/atletsSlice";
import { AtletColumnAdmin } from "@/components/admin/silat/atlet/AtletColumnAdmin";
import { AtletState } from "@/utils/silat/atlet/atletConstats";

const page = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const [limit, setLimit] = useState(itemPerPage);

  const data = useSelector((state: RootState) => state.atlets.all).slice(
    (page - 1) * limit,
    page * limit
  );

  const dispatch = useDispatch();

  const getData = (time: number, exception?: AtletState[]) => {
    console.log("getAtletsAdmin", page, (page - 1) * limit, page * limit);
    setLoading(true);
    let url = `/api/atlets/limit/${time}/${limit}`;
    if (exception?.length)
      url += `/${exception.map((item) => item.waktuPendaftaran)}`;
    axios
      .get(url)
      .then((res) => {
        console.log(res.data.result);
        dispatch(addAtletsRedux(res.data.result));
      })
      .catch((error) => {
        toastFirebaseError(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (page == 1) {
      data.length ? getData(Date.now(), data) : getData(Date.now());
    }
  }, []);

  useEffect(() => {
    if (page > 1) {
      data.length ? getData(timestamp, data) : getData(timestamp);
    }
  }, [page]);

  useEffect(() => {
    if (data.length) setTimestamp(data[data.length - 1].waktuPendaftaran);
  }, [data]);

  useEffect(() => {
    if (limit > itemPerPage) getData(timestamp, data);
  }, [limit]);

  return (
    <AdminTable
      columns={AtletColumnAdmin}
      data={data}
      title="Tabel Atlet"
      page={page}
      nextPage={() => setPage((prev) => prev + 1)}
      prevPage={() => setPage((prev) => prev - 1)}
      disablePrevPage={page == 1}
      disableNextPage={data.length < limit}
      loading={loading}
      showAll={() => setLimit(1000)}
      downloadable
    />
  );
};
export default page;
