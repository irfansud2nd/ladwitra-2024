import KontingenDialog from "./KontingenDialog";

const KontingenNotFound = () => {
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
