"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addCountCategorizedAtlets } from "@/utils/redux/admin/countSlice";
import { RootState } from "@/utils/redux/store";
import {
  jenisPertandingan,
  tingkatanKategoriSilat,
} from "@/utils/silat/atlet/atletConstats";
import { getAllPertandinganUrl } from "@/utils/silat/atlet/atletFunctions";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
  const data = useSelector((state: RootState) => state.count.categorizedAtlets);
  const dispatch = useDispatch();

  const getData = () => {
    const ids = getAllPertandinganUrl();
    ids.map((id) => {
      if (!data.find((item) => item.id == id)) {
        axios
          .get(`/api/atlets/kategori/count/${id}`)
          .then((res) =>
            dispatch(addCountCategorizedAtlets({ id, count: res.data.result }))
          );
      }
    });
  };

  const getCountById = (id: string) => {
    return data.find((item) => item.id == id)?.count || 0;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Table className="w-fit">
      <TableHeader>
        <TableRow>
          <TableHead>Tingkatan</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Putra</TableHead>
          <TableHead>Putri</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tingkatanKategoriSilat.map((tingkatanKategori) => (
          <>
            {tingkatanKategori.kategoriTanding.map(
              (kategori, kategoriIndex) => {
                const key = `Tanding/${tingkatanKategori.tingkatan}/${kategori}`;
                return (
                  <TableRow key={key}>
                    {kategoriIndex == 0 && (
                      <TableCell
                        rowSpan={
                          tingkatanKategori.kategoriTanding.length +
                          tingkatanKategori.kategoriSeni.putra.length
                        }
                      >
                        {tingkatanKategori.tingkatan}
                      </TableCell>
                    )}
                    <TableCell>{kategori}</TableCell>
                    <TableCell>{getCountById(`${key}/Putra`)}</TableCell>
                    <TableCell>{getCountById(`${key}/Putri`)}</TableCell>
                    <TableCell>
                      {getCountById(`${key}/Putra`) +
                        getCountById(`${key}/Putri`)}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
            {tingkatanKategori.kategoriSeni.putra.map((kategori) => {
              const kategoriSeni = kategori.split(" ").slice(0, 1).join("");
              const key = `Seni/${tingkatanKategori.tingkatan}/${kategoriSeni}`;
              return (
                <TableRow key={key}>
                  <TableCell>{kategoriSeni}</TableCell>
                  <TableCell>{getCountById(`${key} Putra/Putra`)}</TableCell>
                  <TableCell>{getCountById(`${key} Putri/Putri`)}</TableCell>
                  <TableCell>
                    {getCountById(`${key} Putra/Putra`) +
                      getCountById(`${key} Putri/Putri`)}
                  </TableCell>
                </TableRow>
              );
            })}
          </>
        ))}
      </TableBody>
    </Table>
  );
};
export default page;
