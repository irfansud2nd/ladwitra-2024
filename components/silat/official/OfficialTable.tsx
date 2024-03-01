"use client";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { RootState } from "@/utils/redux/store";
import { useSelector } from "react-redux";
import { OfficialColumn } from "./OfficialColumn";

const OfficialTable = () => {
  const officials = useSelector(
    (state: RootState) => state.officials.registered
  );
  return <DataTable columns={OfficialColumn} data={officials} />;
};
export default OfficialTable;
