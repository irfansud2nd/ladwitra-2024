"use client";
import { DataTable } from "@/components/utils/tabel/DataTable";
import { AtletColumn } from "./AtletColumn";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";

const AtletTable = () => {
  const atlets = useSelector((state: RootState) => state.atlets.all);
  return <DataTable columns={AtletColumn} data={atlets} />;
};
export default AtletTable;
