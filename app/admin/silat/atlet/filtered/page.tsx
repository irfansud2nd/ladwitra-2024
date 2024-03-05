"use client";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemPerPage } from "@/utils/constants";
import { RootState } from "@/utils/redux/store";
import axios from "axios";
import { toastFirebaseError } from "@/utils/functions";
import { addAtletsRedux } from "@/utils/redux/silat/atletsSlice";
import { FilteredAtletColumnAdmin } from "@/components/admin/silat/atlet/AtletColumnAdmin";

import {
  jenisPertandingan,
  tingkatanKategoriSilat,
} from "@/utils/silat/atlet/atletConstats";
import SelectComponent from "@/components/inputs/SelectComponent";
import { jenisKelaminPeserta } from "@/utils/form/FormConstants";
import { selectCategorySilat } from "@/utils/silat/atlet/atletFunctions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const page = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const [limit, setLimit] = useState(itemPerPage);
  const [pertandingan, setPertandingan] = useState({
    jenisPertandingan: "Tanding",
    tingkatan: "SD I",
    jenisKelamin: "Putra",
    kategori: "",
  });
  const [idPertandingan, setIdPertandingan] = useState("");

  const dispatch = useDispatch();
  const allData = useSelector((state: RootState) => state.atlets.filtered);

  const getDataById = (id: string) => {
    return (
      allData
        .find((item) => item.idPertandingan == id)
        ?.atlets.slice((page - 1) * limit, page * limit) || []
    );
  };

  const getData = (time: number, id?: string) => {
    const pertandingan = id ? id : idPertandingan;
    console.log("getData", time, pertandingan);
    setLoading(true);
    axios
      .get(`/api/atlets/kategori/${pertandingan}/${time}/${limit}`)
      .then((res) => {
        dispatch(addAtletsRedux(res.data.result));
      })
      .catch((error) => {
        toastFirebaseError(error);
      })
      .finally(() => setLoading(false));
  };

  const handleClick = () => {
    const { jenisPertandingan, tingkatan, kategori, jenisKelamin } =
      pertandingan;
    if (!jenisPertandingan || !tingkatan || !kategori || !jenisKelamin) {
      toast.error("Tolong lengkapi kategori terlebih dahulu");
      return;
    }

    const currentId = `${jenisPertandingan}/${tingkatan}/${kategori}/${jenisKelamin}`;

    if (idPertandingan != currentId) {
      setIdPertandingan(currentId);
      if (!getDataById(currentId).length) {
        getData(Date.now(), currentId);
      }
    }
  };

  const data = getDataById(idPertandingan);

  useEffect(() => {
    if (page > 1 && !data.length) getData(timestamp);
  }, [page]);

  useEffect(() => {
    if (data.length) setTimestamp(data[data.length - 1].waktuPendaftaran);
  }, [data]);

  useEffect(() => {
    if (limit > itemPerPage && idPertandingan) getData(timestamp);
  }, [limit]);

  useEffect(() => {
    const { jenisPertandingan, tingkatan, kategori, jenisKelamin } =
      pertandingan;
    const kategoris = selectCategorySilat(
      tingkatan,
      jenisPertandingan,
      jenisKelamin
    );
    if (kategori != kategoris[0]) {
      setPertandingan((prev) => ({ ...prev, kategori: kategoris[0] }));
    }
  }, [
    pertandingan.jenisKelamin,
    pertandingan.jenisPertandingan,
    pertandingan.tingkatan,
  ]);

  return (
    <div className="grid grid-rows-[auto_1fr] gap-y-1">
      <div className="flex gap-1">
        <SelectComponent
          placeholder="Jenis Pertandingan"
          options={jenisPertandingan}
          value={pertandingan.jenisPertandingan}
          onChange={(value) =>
            setPertandingan((prev) => ({ ...prev, jenisPertandingan: value }))
          }
        />
        <SelectComponent
          placeholder="Tingkatan"
          options={tingkatanKategoriSilat.map((item) => item.tingkatan)}
          value={pertandingan.tingkatan}
          onChange={(value) =>
            setPertandingan((prev) => ({ ...prev, tingkatan: value }))
          }
        />
        <SelectComponent
          placeholder="Kategori"
          options={selectCategorySilat(
            pertandingan.tingkatan,
            pertandingan.jenisPertandingan,
            pertandingan.jenisKelamin
          )}
          value={pertandingan.kategori}
          onChange={(value) =>
            setPertandingan((prev) => ({ ...prev, kategori: value }))
          }
        />
        <SelectComponent
          placeholder="Jenis Kelamin"
          options={jenisKelaminPeserta}
          value={pertandingan.jenisKelamin}
          onChange={(value) =>
            setPertandingan((prev) => ({ ...prev, jenisKelamin: value }))
          }
        />
        <Button onClick={handleClick}>Search</Button>
      </div>

      <AdminTable
        columns={FilteredAtletColumnAdmin}
        data={data}
        title={`Tabel Atlet - ${idPertandingan}`}
        page={page}
        nextPage={() => setPage((prev) => prev + 1)}
        prevPage={() => setPage((prev) => prev - 1)}
        disablePrevPage={page == 1}
        disableNextPage={data.length < limit || idPertandingan == ""}
        loading={loading}
        showAll={() => setLimit(1000)}
        downloadable
      />
    </div>
  );
};
export default page;
