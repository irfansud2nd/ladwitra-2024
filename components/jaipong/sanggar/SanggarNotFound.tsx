import SanggarDialog from "./SanggarDialog";

const SanggarNotFound = () => {
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
