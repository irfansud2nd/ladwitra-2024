import { JenisTarian } from "@/utils/jaipong/penari/penariConstants";
import RegisterPenariDialog from "./RegisterPenariDialog";
import RegisteredPenariTable from "./RegisteredPenariTable";

const RegisterPenariPage = ({ jenis }: { jenis: JenisTarian }) => {
  return (
    <div className="max-w-full h-full grid grid-rows-[auto_1fr]">
      <div className="flex justify-between items-center mb-1">
        <h1 className="daftar_page_title">Penari Kategori {jenis}</h1>
        <RegisterPenariDialog jenis={jenis} />
      </div>
      <div className="max-w-full overflow-hidden h-full border-2 rounded bg-background brightness-95 dark:brightness-150 p-2">
        <RegisteredPenariTable jenis={jenis} />
      </div>
    </div>
  );
};
export default RegisterPenariPage;
