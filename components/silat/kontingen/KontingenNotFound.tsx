"use client";
import { closePayment, closePendaftaran, editOnly } from "@/utils/constants";
import KontingenDialog from "./KontingenDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";

const KontingenNotFound = () => {
  const { silatLimit } = useSelector((state: RootState) => state.count);
  const disableAdd = editOnly || silatLimit || closePayment || closePendaftaran;

  return (
    <div className="h-full w-full flex justify-center items-center text-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">
          Tidak ada kontingen terdaftar
        </h1>
        <p className="text-muted-foreground">
          {disableAdd
            ? "Maaf, pendaftaran telah ditutup"
            : "Daftarkan kontingen terlebih dahulu untuk melanjutkan"}
        </p>
        {disableAdd ? (
          <Button>
            <Link href={"/"}>Kembali ke halaman awal</Link>
          </Button>
        ) : (
          <KontingenDialog />
        )}
      </div>
    </div>
  );
};
export default KontingenNotFound;
