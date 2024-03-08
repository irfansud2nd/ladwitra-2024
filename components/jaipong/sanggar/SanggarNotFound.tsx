"use client";
import { editOnly, jaipongLimit } from "@/utils/constants";
import SanggarDialog from "./SanggarDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";

const SanggarNotFound = () => {
  const limit =
    useSelector((state: RootState) => state.pendaftaran.jaipongLimit) >=
    jaipongLimit;

  if (editOnly || limit)
    return (
      <div className="h-full w-full flex justify-center items-center text-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold">
            Tidak ada sanggar terdaftar
          </h1>
          <p className="text-muted-foreground">
            Maaf, pendaftaran telah ditutup
          </p>
          <Button>
            <Link href={"/"}>Kembali ke halaman awal</Link>
          </Button>
        </div>
      </div>
    );

  return (
    <div className="h-full w-full flex justify-center items-center text-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">Tidak ada sanggar terdaftar</h1>
        <p className="text-muted-foreground">
          Daftarkan sanggar terlebih dahulu untuk melanjutkan
        </p>
        <SanggarDialog />
      </div>
    </div>
  );
};
export default SanggarNotFound;
