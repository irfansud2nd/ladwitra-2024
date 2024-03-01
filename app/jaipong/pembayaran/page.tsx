import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UnpaidPenari from "@/components/jaipong/penari/UnpaidPenari";
import ConfirmedPenariTable from "@/components/jaipong/penari/ConfimedPenariTable";
import UnconfirmedPenariTable from "@/components/jaipong/penari/UnconfirmedPenariTable";

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
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Menunggu Pembayaran" />
          </SelectTrigger>
          <SelectContent>
            <TabsList asChild className="flex flex-col h-full">
              <SelectGroup>
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
            </TabsList>
          </SelectContent>
        </Select>
      </div>
      <div className="*:w-full *:h-full *:rounded *:p-1">
        <TabsContent value="unpaid">
          <UnpaidPenari />
        </TabsContent>
        <TabsContent value="unconfirmed">
          <UnconfirmedPenariTable />
        </TabsContent>
        <TabsContent value="confirmed">
          <ConfirmedPenariTable />
        </TabsContent>
      </div>
    </Tabs>
  );
};
export default page;
