import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UnpaidAtlet from "@/components/silat/atlet/UnpaidAtlet";
import UnconfirmedAtletTable from "@/components/silat/atlet/UnconfirmedAtletTable";
import ConfirmedAtletTable from "@/components/silat/atlet/ConfirmedAtletTable";

const page = () => {
  return (
    <Tabs
      defaultValue="unpaid"
      className="w-full h-full pb-2 grid grid-rows-[auto_1fr]"
    >
      {/* TABS LIST DESKTOP */}
      <TabsList className="daftar_page_title w-full sm:w-[calc(100%-2.5rem)] justify-around hidden sm:flex">
        <TabsTrigger value="unpaid">Menunggu Pembayaran</TabsTrigger>
        <TabsTrigger value="unconfirmed">Menunggu Konfirmasi</TabsTrigger>
        <TabsTrigger value="confirmed">Pembayaran Selesai</TabsTrigger>
      </TabsList>
      {/* TABS LIST MOBILE */}
      <div className="block sm:hidden">
        <TabsList className="w-full">
          <Select>
            <SelectTrigger className="flex justify-center w-full">
              <SelectValue placeholder="Menunggu Pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="text-center *:block">
                <TabsTrigger value="unpaid" asChild>
                  <SelectItem value="unpaid">Menunggu Pembayaran</SelectItem>
                </TabsTrigger>
                <TabsTrigger value="unconfirmed" asChild>
                  <SelectItem value="unconfirmed">
                    Menunggu Konfirmasi
                  </SelectItem>
                </TabsTrigger>
                <TabsTrigger value="confirmed" asChild>
                  <SelectItem value="confirmed">Pembayaran Selesai</SelectItem>
                </TabsTrigger>
              </SelectGroup>
            </SelectContent>
          </Select>
        </TabsList>
      </div>
      <div className="*:w-full *:h-full *:rounded *:p-1">
        <TabsContent value="unpaid">
          <UnpaidAtlet />
        </TabsContent>
        <TabsContent value="unconfirmed">
          <UnconfirmedAtletTable />
        </TabsContent>
        <TabsContent value="confirmed">
          <ConfirmedAtletTable />
        </TabsContent>
      </div>
    </Tabs>
  );
};
export default page;
