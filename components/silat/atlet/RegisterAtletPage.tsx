import { JenisPertandingan } from "@/utils/silat/atlet/atletConstants";
import RegisterAtletDialog from "./RegisterAtletDialog";
import RegisteredAtletTable from "./RegisteredAtletTable";
import PersonLoading from "@/components/loadings/PersonLoading";

const RegisterAtletPage = ({ jenis }: { jenis: JenisPertandingan }) => {
  return (
    <div className="max-w-full h-full grid grid-rows-[auto_1fr]">
      <div className="flex justify-between items-center mb-1">
        <h1 className="daftar_page_title">Atlet Kategori {jenis}</h1>
        <RegisterAtletDialog jenis={jenis} />
      </div>
      <div className="max-w-full overflow-hidden h-full border-2 rounded bg-background brightness-95 dark:brightness-150 p-2">
        <RegisteredAtletTable jenis={jenis} />
      </div>
    </div>
  );
};
export default RegisterAtletPage;
