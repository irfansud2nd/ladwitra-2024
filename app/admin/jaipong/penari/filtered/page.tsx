"use client";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemPerPage } from "@/utils/constants";
import { RootState } from "@/utils/redux/store";
import axios from "axios";
import { toastFirebaseError } from "@/utils/functions";
import SelectComponent from "@/components/inputs/SelectComponent";
import { jenisKelaminPeserta } from "@/utils/form/FormConstants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addPenarisRedux } from "@/utils/redux/jaipong/penarisSlice";
import { selectCategoryJaipong } from "@/utils/jaipong/penari/penariFunctions";
import {
  jenisTarian,
  kelasTarian,
  tingkatanKategoriJaipong,
} from "@/utils/jaipong/penari/penariConstants";
import { FilteredPenariColumnAdmin } from "@/components/admin/jaipong/penari/PenariColumnAdmin";

const page = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  const [limit, setLimit] = useState(itemPerPage);
  const [tarian, setTarian] = useState({
    jenisTarian: "Tunggal",
    kelas: "Pemula",
    tingkatan: "SD I",
    kategori: "",
    jenisKelamin: "Putra",
  });
  const [idTarian, setIdTarian] = useState("");

  const dispatch = useDispatch();
  const allData = useSelector((state: RootState) => state.penaris.filtered);

  const getDataById = (id: string) => {
    return (
      allData
        .find((item) => item.idTarian == id)
        ?.penaris.slice((page - 1) * limit, page * limit) || []
    );
  };

  const getData = (time: number, id?: string) => {
    const tarian = id ? id : idTarian;
    console.log("getData", time, tarian);
    setLoading(true);
    axios
      .get(`/api/penaris/kategori/${tarian}/${time}/${limit}`)
      .then((res) => {
        dispatch(addPenarisRedux(res.data.result));
      })
      .catch((error) => {
        toastFirebaseError(error);
      })
      .finally(() => setLoading(false));
  };

  const handleClick = () => {
    const { jenisTarian, kelas, tingkatan, kategori, jenisKelamin } = tarian;
    if (!jenisTarian || !kelas || !tingkatan || !kategori || !jenisKelamin) {
      toast.error("Tolong lengkapi kategori terlebih dahulu");
      return;
    }

    const currentId = `${jenisTarian}/${kelas}/${tingkatan}/${kategori}/${jenisKelamin}`;

    if (idTarian != currentId) {
      setIdTarian(currentId);
      if (!getDataById(currentId).length) {
        getData(Date.now(), currentId);
      }
    }
  };

  const data = getDataById(idTarian);

  useEffect(() => {
    if (page > 1 && !data.length) {
      getData(timestamp);
    } else if (page > 1 && data.length < limit) {
      getData(data[data.length - 1].waktuPendaftaran);
    }
  }, [page]);

  useEffect(() => {
    if (data.length) setTimestamp(data[data.length - 1].waktuPendaftaran);
  }, [data]);

  useEffect(() => {
    if (limit > itemPerPage && idTarian) getData(timestamp);
  }, [limit]);

  useEffect(() => {
    const { tingkatan, kategori } = tarian;
    const kategoris = selectCategoryJaipong(tingkatan);
    if (kategori != kategoris[0]) {
      setTarian((prev) => ({ ...prev, kategori: kategoris[0] }));
    }
  }, [tarian.tingkatan]);

  return (
    <div className="grid grid-rows-[auto_1fr] gap-y-1">
      <div className="flex gap-1">
        <SelectComponent
          placeholder="Jenis Tarian"
          options={jenisTarian}
          value={tarian.jenisTarian}
          onChange={(value) =>
            setTarian((prev) => ({ ...prev, jenisTarian: value }))
          }
        />
        <SelectComponent
          placeholder="Kelas"
          options={kelasTarian}
          value={tarian.kelas}
          onChange={(value) => setTarian((prev) => ({ ...prev, kelas: value }))}
        />
        <SelectComponent
          placeholder="Tingkatan"
          options={tingkatanKategoriJaipong.map((item) => item.tingkatan)}
          value={tarian.tingkatan}
          onChange={(value) =>
            setTarian((prev) => ({ ...prev, tingkatan: value }))
          }
        />
        <SelectComponent
          placeholder="Kategori"
          options={selectCategoryJaipong(tarian.tingkatan)}
          value={tarian.kategori}
          onChange={(value) =>
            setTarian((prev) => ({ ...prev, kategori: value }))
          }
        />
        <SelectComponent
          placeholder="Jenis Kelamin"
          options={jenisKelaminPeserta}
          value={tarian.jenisKelamin}
          onChange={(value) =>
            setTarian((prev) => ({ ...prev, jenisKelamin: value }))
          }
        />
        <Button onClick={handleClick}>Search</Button>
      </div>

      <AdminTable
        columns={FilteredPenariColumnAdmin}
        data={data}
        title={`Tabel Penari - ${idTarian}`}
        page={page}
        nextPage={() => setPage((prev) => prev + 1)}
        prevPage={() => setPage((prev) => prev - 1)}
        disablePrevPage={page == 1}
        disableNextPage={data.length < limit || idTarian == ""}
        loading={loading}
        showAll={() => setLimit(1000)}
        downloadable
      />
    </div>
  );
};
export default page;
