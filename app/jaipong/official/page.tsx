import KoreograferDialog from "@/components/jaipong/koreografer/KoreograferDialog";
import KoreograferTable from "@/components/jaipong/koreografer/KoreograferTable";

const page = () => {
  return (
    <div className="max-w-full h-full grid grid-rows-[auto_1fr]">
      <div className="flex justify-between items-center mb-1">
        <h1 className="daftar_page_title">Daftar Official</h1>
        <KoreograferDialog />
      </div>
      <div className="max-w-full overflow-hidden h-full border-2 rounded bg-background brightness-95 dark:brightness-150 p-2">
        <KoreograferTable />
      </div>
    </div>
  );
};
export default page;
