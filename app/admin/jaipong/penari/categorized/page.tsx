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
import {
  getAllTarianUrl,
  splitTarianId,
} from "@/utils/jaipong/penari/penariFunctions";
import { addCountCategorizedPenaris } from "@/utils/redux/admin/countSlice";
import { RootState } from "@/utils/redux/store";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InlineLoading from "@/components/loadings/InlineLoading";

const page = () => {
  const data = useSelector(
    (state: RootState) => state.count.categorizedPenaris
  );
  const dispatch = useDispatch();

  const getData = () => {
    const ids = getAllTarianUrl();
    ids.map((id) => {
      if (!data.find((item) => item.id == id)) {
        const { jenisTarian, kelas, tingkatan, kategori, jenisKelamin } =
          splitTarianId(id);
        axios
          .get(
            `/api/penaris/kategori?jenis=${jenisTarian}&kelas=${kelas}&tingkatan=${tingkatan}&kategori=${kategori}&jenisKelamin=${jenisKelamin}&count=true`
          )
          .then((res) => {
            console.table({ result: res.data.result, id });
            dispatch(
              addCountCategorizedPenaris({ id, count: res.data.result })
            );
          });
      }
    });
  };

  const getCountById = (id: string, numberOnly: boolean = false) => {
    let result: any = data.find((item) => item.id == id)?.count;
    if (result == undefined) result = numberOnly ? 0 : <InlineLoading />;
    return result;
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
                      <TableCell>{getCountById(`${key}/Putri`)}</TableCell>
                      <TableCell>
                        {getCountById(`${key}/Putra`, true) +
                          getCountById(`${key}/Putri`, true)}
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
