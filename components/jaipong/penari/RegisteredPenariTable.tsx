"use client";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { JenisTarian } from "@/utils/jaipong/penari/penariConstants";
import {
  RegisteredPenariColumn,
  RegisteredPenariColumnTunggal,
} from "./RegisteredPenariColumn";

const RegisteredPenariTable = ({ jenis }: { jenis: JenisTarian }) => {
  const registeredPenaris = useSelector(
    (state: RootState) => state.penaris.registered
  );
  return (
    <DataTable
      columns={
        jenis == "Tunggal"
          ? RegisteredPenariColumnTunggal
          : RegisteredPenariColumn
      }
      data={registeredPenaris.filter(
        (penari) => penari.tarian[0].jenis == jenis
      )}
    />
  );
};
export default RegisteredPenariTable;
