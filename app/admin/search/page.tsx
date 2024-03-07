"use client";
import SearchBar from "@/components/admin/SearchBar";
import { KoreograferColumnAdmin } from "@/components/admin/jaipong/koreografer/KoreograferColumnAdmin";
import { PenariColumnAdmin } from "@/components/admin/jaipong/penari/PenariColumnAdmin";
import { SanggarColumnAdmin } from "@/components/admin/jaipong/sanggar/SanggarColumnAdmin";
import { AtletColumnAdmin } from "@/components/admin/silat/atlet/AtletColumnAdmin";
import { KontingenColumnAdmin } from "@/components/admin/silat/kontingen/KontingenColumnAdmin";
import { OfficialColumnAdmin } from "@/components/admin/silat/official/OfficialColumnAdmin";
import { AdminTable } from "@/components/utils/tabel/AdminTable";
import { toastFirebaseError } from "@/utils/functions";
import { KoreograferState } from "@/utils/jaipong/koreografer/koreograferConstants";
import { PenariState } from "@/utils/jaipong/penari/penariConstants";
import { SanggarState } from "@/utils/jaipong/sanggar/sanggarConstants";
import { AtletState } from "@/utils/silat/atlet/atletConstats";
import { KontingenState } from "@/utils/silat/kontingen/kontingenConstants";
import { OfficialState } from "@/utils/silat/official/officialConstants";
import axios from "axios";
import { useEffect, useState } from "react";

const page = () => {
  const [targetCollection, setTargetCollection] = useState("kontingen");
  const [query, setQuery] = useState("");
  const [prevQuery, setPrevQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    setLoading(true);
    setPrevQuery(query);
    const url = `/api/${targetCollection}s/search/${query}`;
    axios
      .get(url)
      .then((res) => setData(res.data.result))
      .catch((error) => toastFirebaseError(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (query != prevQuery) getData();
  }, [query]);

  const getTableProp = () => {
    const result: {
      column: any;
      array: any[];
    } = {
      column: KontingenColumnAdmin,
      array: data as KontingenState[],
    };
    switch (targetCollection) {
      case "kontingen":
        result.column = KontingenColumnAdmin;
        result.array = data as KontingenState[];
        break;
      case "official":
        result.column = OfficialColumnAdmin;
        result.array = data as OfficialState[];
        break;
      case "atlet":
        result.column = AtletColumnAdmin;
        result.array = data as AtletState[];
        break;
      case "sanggar":
        result.column = SanggarColumnAdmin;
        result.array = data as SanggarState[];
        break;
      case "penari":
        result.column = PenariColumnAdmin;
        result.array = data as PenariState[];
        break;
      case "koreografer":
        result.column = KoreograferColumnAdmin;
        result.array = data as KoreograferState[];
        break;
    }
    return result;
  };

  const { column, array } = getTableProp();

  return (
    <div className="grid grid-rows-[auto_1fr] w-full h-full">
      <SearchBar
        setTargetCollection={setTargetCollection}
        targetCollection={targetCollection}
        setQuery={setQuery}
      />
      {prevQuery && (
        <AdminTable
          columns={column}
          data={array}
          title={`Hasil Pencarian ${targetCollection}`}
          loading={loading}
        />
      )}
    </div>
  );
};
export default page;
