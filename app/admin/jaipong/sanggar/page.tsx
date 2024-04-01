"use client";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemPerPage } from "@/utils/constants";
import { RootState } from "@/utils/redux/store";
import axios from "axios";
import { toastFirebaseError } from "@/utils/functions";
import { addSanggarsRedux } from "@/utils/redux/jaipong/sanggarSlice";
import { SanggarColumnAdmin } from "@/components/admin/jaipong/sanggar/SanggarColumnAdmin";

const page = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const [limit, setLimit] = useState(itemPerPage);

  const data = useSelector((state: RootState) => state.sanggar.all).slice(
    (page - 1) * limit,
    page * limit
  );

  const dispatch = useDispatch();

  const getData = (time: number) => {
    // console.log("getSanggarsAdmin", page, (page - 1) * limit, page * limit);
    setLoading(true);
    axios
      .get(`/api/sanggars?timestamp=${time}&limit=${limit}`)
      .then((res) => {
        dispatch(addSanggarsRedux(res.data.result));
      })
      .catch((error) => {
        toastFirebaseError(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!data.length && page == 1) getData(Date.now());
  }, []);

  useEffect(() => {
    if (page > 1 && !data.length) getData(timestamp);
  }, [page]);

  useEffect(() => {
    if (data.length) setTimestamp(data[data.length - 1].waktuPendaftaran);
  }, [data]);

  useEffect(() => {
    if (limit > itemPerPage) getData(timestamp);
  }, [limit]);

  return (
    <AdminTable
      columns={SanggarColumnAdmin}
      data={data}
      title="Tabel Sanggar"
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
