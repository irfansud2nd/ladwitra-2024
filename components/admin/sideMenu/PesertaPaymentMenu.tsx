import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Link from "next/link";
const PesertaPaymentMenu = ({
  label,
  prefixPeserta,
  paymentSource,
  summary,
}: {
  label: string;
  prefixPeserta: string;
  paymentSource: string;
  summary: JSX.Element;
}) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={label} className="border-none">
        <AccordionTrigger className="pb-4 pt-0">{label}</AccordionTrigger>
        <AccordionContent className="ml-2">
          <Link href={`${prefixPeserta}`}>All</Link>
        </AccordionContent>
        <AccordionContent className="ml-2">
          <Link href={`${prefixPeserta}/filtered`}>Filter Kategori</Link>
        </AccordionContent>
        <AccordionContent className="ml-2">
          <Link href={`${prefixPeserta}/categorized`}>Jumlah Per Kategori</Link>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value={`${label}-pembayaran`} className="border-none">
        <AccordionTrigger className="pb-4 pt-0">Pembayaran</AccordionTrigger>
        <AccordionContent className="ml-2">
          <Link href={`/admin/payment/${paymentSource}/unconfirmed`}>
            Menunggu Konfirmasi
          </Link>
        </AccordionContent>
        <AccordionContent className="ml-2">
          <Link href={`/admin/payment/${paymentSource}/confirmed`}>
            Sudah Dikonfirmasi
          </Link>
        </AccordionContent>
        <AccordionContent className="ml-2">{summary}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
export default PesertaPaymentMenu;
