"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  jenisTarian,
  kelasTarian,
  tingkatanKategoriJaipong,
} from "@/utils/jaipong/penari/penariConstants";
import { getAllTarianUrl } from "@/utils/jaipong/penari/penariFunctions";
import { addCountCategorizedPenaris } from "@/utils/redux/admin/countSlice";
import { RootState } from "@/utils/redux/store";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
  const data = useSelector(
    (state: RootState) => state.count.categorizedPenaris
  );
  const dispatch = useDispatch();

  const getData = () => {
    const ids = getAllTarianUrl();
    ids.map((id) => {
      if (!data.find((item) => item.id == id)) {
        axios
          .get(`/api/penaris/kategori/count/${id}`)
          .then((res) =>
            dispatch(addCountCategorizedPenaris({ id, count: res.data.result }))
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
    <Table className="w/fit">
      <TableHeader>
        <TableRow>
          <TableHead>Jenis</TableHead>
          <TableHead>Kelas</TableHead>
          <TableHead>Tingkatan</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead>Putra</TableHead>
          <TableHead>Putri</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jenisTarian.map((jenis) =>
          kelasTarian.map((kelas, kelasIndex) =>
            tingkatanKategoriJaipong.map(
              (tingkatanKategori, tingkatanKategoriIndex) =>
                tingkatanKategori.kategori.map((kategori, kategoriIndex) => {
                  const key = `${jenis}/${kelas}/${tingkatanKategori.tingkatan}/${kategori}`;
                  return (
                    <TableRow key={key}>
                      {kelasIndex == 0 &&
                        tingkatanKategoriIndex == 0 &&
                        kategoriIndex == 0 && (
                          <TableCell rowSpan={18}>{jenis}</TableCell>
                        )}
                      {tingkatanKategoriIndex == 0 && kategoriIndex == 0 && (
                        <TableCell rowSpan={9}>{kelas}</TableCell>
                      )}
                      {kategoriIndex == 0 && (
                        <TableCell rowSpan={3}>
                          {tingkatanKategori.tingkatan}
                        </TableCell>
                      )}
                      <TableCell>{kategori}</TableCell>
                      <TableCell>{getCountById(`${key}/Putra`)}</TableCell>
                      <TableCell>{getCountById(`${key}/Putra`)}</TableCell>
                      <TableCell>
                        {getCountById(`${key}/Putra`) +
                          getCountById(`${key}/Putri`)}
                      </TableCell>
                    </TableRow>
                  );
                })
            )
          )
        )}
      </TableBody>
    </Table>
  );
};
export default page;
