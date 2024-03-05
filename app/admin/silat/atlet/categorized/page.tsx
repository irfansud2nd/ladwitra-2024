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
import { tingkatanKategoriSilat } from "@/utils/silat/atlet/atletConstats";
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
    return data.find((item) => item.id == id)?.count;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Table className="w/fit">
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
            <TableRow key={tingkatanKategori.tingkatan}>
              <TableCell
                rowSpan={
                  tingkatanKategori.kategoriTanding.length +
                  tingkatanKategori.kategoriSeni.putra.length
                }
                className="align-top"
              >
                {tingkatanKategori.tingkatan}
              </TableCell>
              <TableCell>{tingkatanKategori.kategoriTanding[0]}</TableCell>
              <TableCell>
                {getCountById(
                  `Tanding/${tingkatanKategori.tingkatan}/${tingkatanKategori.kategoriTanding[0]}/Putra`
                )}
              </TableCell>
              <TableCell>
                {getCountById(
                  `Tanding/${tingkatanKategori.tingkatan}/${tingkatanKategori.kategoriTanding[0]}/Putri`
                )}
              </TableCell>
            </TableRow>
            {tingkatanKategori.kategoriTanding
              .slice(1)
              .map((kategoriTanding) => (
                <TableRow>
                  <TableCell>{kategoriTanding}</TableCell>
                  <TableCell>
                    {getCountById(
                      `Tanding/${tingkatanKategori.tingkatan}/${kategoriTanding}/Putra`
                    )}
                  </TableCell>
                  <TableCell>
                    {getCountById(
                      `Tanding/${tingkatanKategori.tingkatan}/${kategoriTanding}/Putri`
                    )}
                  </TableCell>
                </TableRow>
              ))}
            {tingkatanKategori.kategoriSeni.putra.map((kategoriSeni) => {
              const kategori = kategoriSeni.split(" ").slice(0, -1).join("");
              return (
                <TableRow>
                  <TableCell>{kategori}</TableCell>
                  <TableCell>
                    {getCountById(
                      `Seni/${tingkatanKategori.tingkatan}/${kategori} Putra/Putra`
                    )}
                  </TableCell>
                  <TableCell>
                    {getCountById(
                      `Seni/${tingkatanKategori.tingkatan}/${kategori} Putri/Putri`
                    )}
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
