import AtletTable from "@/components/silat/atlet/AtletTable";
import AtletDialog from "@/components/silat/atlet/AtletDialog";

const page = () => {
  return (
    <div className="max-w-full h-full grid grid-rows-[auto_1fr]">
      <div className="flex justify-between items-center mb-1">
        <h1 className="daftar_page_title">Daftar Atlet Silat</h1>
        <AtletDialog />
      </div>
      <div className="max-w-full overflow-hidden h-full border-2 rounded bg-background brightness-95 dark:brightness-150 p-2">
        <AtletTable />
      </div>
    </div>
  );
};
export default page;
