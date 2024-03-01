"use client";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { KoreograferColumn } from "./KoreograferColumn";

const KoreograferTable = () => {
  const koreografers = useSelector(
    (state: RootState) => state.koreografers.registered
  );
  return <DataTable columns={KoreograferColumn} data={koreografers} />;
};
export default KoreograferTable;
