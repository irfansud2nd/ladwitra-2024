"use client";
import { editOnly, silatLimit } from "@/utils/constants";
import KontingenDialog from "./KontingenDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";

const KontingenNotFound = () => {
  const limit =
    useSelector((state: RootState) => state.pendaftaran.silatLimit) >=
    silatLimit;

  if (editOnly || limit)
    return (
      <div className="h-full w-full flex justify-center items-center text-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold">
            Tidak ada kontingen terdaftar
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
        <h1 className="text-3xl font-semibold">
          Tidak ada kontingen terdaftar
        </h1>
        <p className="text-muted-foreground">
          Daftarkan kontingen terlebih dahulu untuk melanjutkan
        </p>
        <KontingenDialog />
      </div>
    </div>
  );
};
export default KontingenNotFound;
