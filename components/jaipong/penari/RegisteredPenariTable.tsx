"use client";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { JenisTarian } from "@/utils/jaipong/penari/penariConstants";
import { RegisteredPenariColumn } from "./RegisteredPenariColumn";

const RegisteredPenariTable = ({ jenis }: { jenis: JenisTarian }) => {
  const registeredPenaris = useSelector(
    (state: RootState) => state.penaris.registered
  );
  return (
    <DataTable
      columns={RegisteredPenariColumn(jenis)}
      data={registeredPenaris.filter(
        (penari) => penari.tarian[0].jenis == jenis
      )}
    />
  );
};
export default RegisteredPenariTable;
