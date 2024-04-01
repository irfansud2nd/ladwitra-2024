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
import {
  getTarianId,
  selectCategoryJaipong,
  selectLagu,
  splitTarianId,
} from "@/utils/jaipong/penari/penariFunctions";
import {
  jenisTarian,
  kelasTarian,
  tingkatanKategoriJaipong,
} from "@/utils/jaipong/penari/penariConstants";
import { FilteredPenariColumnAdmin } from "@/components/admin/jaipong/penari/PenariColumnAdmin";
import FullLoading from "@/components/loadings/FullLoading";

const page = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(itemPerPage);
  const [limit, setLimit] = useState(1);
  const [tarian, setTarian] = useState({
    jenisTarian: "Tunggal",
    kelas: "Pemasalan",
    tingkatan: "SD I",
    kategori: "",
    jenisKelamin: "Putra",
    lagu: "",
  });
  const [idTarian, setIdTarian] = useState("");

  const dispatch = useDispatch();
  const allData = useSelector((state: RootState) => state.penaris.all);

  const getDataById = (id: string) => {
    const { jenisTarian, kelas, tingkatan, kategori, jenisKelamin, lagu } =
      splitTarianId(id);
    let result = allData.filter(
      (penari) =>
        penari.tarian.find(
          (tarian) =>
            tarian.jenis == jenisTarian &&
            tarian.kelas == kelas &&
            tarian.tingkatan == tingkatan &&
            tarian.kategori == kategori
        ) && penari.jenisKelamin == jenisKelamin
    );

    if (lagu)
      result = result.filter((penari) =>
        penari.lagu.find(
          (lagu) =>
            lagu.idTarian ==
              getTarianId({ jenis: jenisTarian, kelas, tingkatan, kategori }) &&
            lagu == lagu
        )
      );

    result = result.slice((page - 1) * limit, page * limit);

    return result;
  };

  const getData = (time: number, id?: string) => {
    const tarian = id ? id : idTarian;
    // console.log("getData", time, tarian);
    const { jenisTarian, kelas, tingkatan, kategori, jenisKelamin, lagu } =
      splitTarianId(tarian);
    let url = `/api/penaris/kategori?jenis=${jenisTarian}&kelas=${kelas}&tingkatan=${tingkatan}&kategori=${kategori}&jenisKelamin=${jenisKelamin}&timestamp=${time}&limit=${limit}`;

    if (lagu) url += `&lagu=${lagu}`;

    // url = `/api/penaris/kategori/${tarian}/${time}/${limit}`;

    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        dispatch(addPenarisRedux(res.data.result));
      })
      .catch((error) => {
        toastFirebaseError(error);
      })
      .finally(() => setLoading(false));
  };

  const handleClick = () => {
    const { jenisTarian, kelas, tingkatan, kategori, jenisKelamin, lagu } =
      tarian;

    if (!jenisTarian || !kelas || !tingkatan || !kategori || !jenisKelamin) {
      toast.error("Tolong lengkapi kategori terlebih dahulu");
      return;
    }

    let currentId = `${jenisTarian}/${kelas}/${tingkatan}/${kategori}/${jenisKelamin}`;

    // if (lagu) currentId += `/${lagu}`;

    if (idTarian != currentId) {
      setIdTarian(currentId);
      if (getDataById(currentId).length < limit) {
        getData(Date.now(), currentId);
        return;
      }
      setLoading(true);
      setTimeout(() => setLoading(false), 100);
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

  useEffect(() => {
    const { kelas, lagu, jenisTarian } = tarian;
    const lagus = selectLagu(kelas);
    if (lagu != lagus[0]) {
      setTarian((prev) => ({ ...prev, lagu: lagus[0] }));
    }
    if (jenisTarian == "Rampak") setTarian((prev) => ({ ...prev, lagu: "" }));
  }, [tarian.kelas, tarian.jenisTarian]);

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
        {/* {tarian.jenisTarian == "Tunggal" && (
          <SelectComponent
            placeholder="All"
            options={["All", ...selectLagu(tarian.kelas)]}
            value={tarian.lagu}
            onChange={(value) =>
              setTarian((prev) => ({
                ...prev,
                lagu: value == "All" ? "" : value,
              }))
            }
          />
        )} */}
        <Button onClick={handleClick}>Search</Button>
      </div>
      {idTarian &&
        (loading ? (
          <FullLoading />
        ) : (
          <AdminTable
            columns={FilteredPenariColumnAdmin(idTarian)}
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
        ))}
    </div>
  );
};
export default page;
