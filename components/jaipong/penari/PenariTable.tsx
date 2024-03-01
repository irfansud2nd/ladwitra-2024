"use client";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import { PenariColumn } from "./PenariColumn";

const PenariTable = () => {
  const penaris = useSelector((state: RootState) => state.penaris.all);
  return <DataTable columns={PenariColumn} data={penaris} />;
};
export default PenariTable;
