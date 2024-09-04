"use client";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { RegisteredAtletColumn } from "./RegisteredAtletColum";
import { JenisPertandingan } from "@/utils/silat/atlet/atletConstants";

const RegisteredAtletTable = ({ jenis }: { jenis: JenisPertandingan }) => {
  const registeredAtlets = useSelector(
    (state: RootState) => state.atlets.registered
  );
  return (
    <DataTable
      columns={RegisteredAtletColumn}
      data={registeredAtlets.filter(
        (atlet) => atlet.pertandingan[0].jenis == jenis
      )}
    />
  );
};
export default RegisteredAtletTable;
