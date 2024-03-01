import OfficialTable from "@/components/silat/official/OfficialTable";
import OfficialDialog from "@/components/silat/official/OfficialDialog";

const page = () => {
  return (
    <div className="max-w-full h-full grid grid-rows-[auto_1fr]">
      <div className="flex justify-between items-center mb-1">
        <h1 className="daftar_page_title">Daftar Official</h1>
        <OfficialDialog />
      </div>
      <div className="max-w-full overflow-hidden h-full border-2 rounded bg-background brightness-95 dark:brightness-150 p-2">
        <OfficialTable />
      </div>
    </div>
  );
};
export default page;
