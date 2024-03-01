import PenariDialog from "@/components/jaipong/penari/PenariDialog";
import PenariTable from "@/components/jaipong/penari/PenariTable";

const page = () => {
  return (
    <div className="max-w-full h-full grid grid-rows-[auto_1fr]">
      <div className="flex justify-between items-center mb-1">
        <h1 className="daftar_page_title">Daftar Penari Jaipong</h1>
        <PenariDialog />
      </div>
      <div className="max-w-full overflow-hidden h-full border-2 rounded bg-background brightness-95 dark:brightness-150 p-2">
        <PenariTable />
      </div>
    </div>
  );
};
export default page;
