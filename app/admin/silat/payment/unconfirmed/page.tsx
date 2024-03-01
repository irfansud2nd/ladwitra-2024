import UnconfirmedAtletPayment from "@/components/admin/silat/atlet/tabel/UnconfirmedAtletPayment";

const page = () => {
  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr]">
      <h1>Menunggu Konfirmasi</h1>
      <UnconfirmedAtletPayment />
    </div>
  );
};
export default page;
