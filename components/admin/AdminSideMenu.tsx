import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import SilatPaymentSummary from "./payment/silat/SilatPaymentSummary";
import PesertaPaymentMenu from "./sideMenu/PesertaPaymentMenu";
import JaipongPaymentSummary from "./payment/JaipongPaymentSummary";

type Menus = {
  label: string;
  menus?: Menus;
  href?: string;
  prefix?: string;
  component?: JSX.Element;
}[];

const AdminSideMenu = () => {
  return (
    <div className="flex flex-col gap-1 sm:border-r-2 h-full w-full sm:w-[170px] p-2">
      <Link className="py-2 font-medium" href={"/admin"}>
        Dashboard
      </Link>
      <Link className="py-2 font-medium" href={"/admin/search"}>
        Search
      </Link>
      <Accordion type="single" collapsible>
        <AccordionItem value="silat">
          <AccordionTrigger className="text-base">Silat</AccordionTrigger>
          <AccordionContent>
            <Link href={"/admin/silat/kontingen"}>Kontingen</Link>
          </AccordionContent>
          <AccordionContent>
            <Link href={"/admin/silat/official"}>Official</Link>
          </AccordionContent>
          <AccordionContent>
            <PesertaPaymentMenu
              label="Atlet"
              prefixPeserta="/admin/silat/atlet"
              paymentSource="silat"
              summary={<SilatPaymentSummary />}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="jaipong">
          <AccordionTrigger className="text-base">Jaipong</AccordionTrigger>
          <AccordionContent>
            <Link href={"/admin/jaipong/sanggar"}>Sanggar</Link>
          </AccordionContent>
          <AccordionContent>
            <Link href={"/admin/jaipong/koreografer"}>Koreografer</Link>
          </AccordionContent>
          <AccordionContent>
            <PesertaPaymentMenu
              label="Penari"
              prefixPeserta="/admin/jaipong/penari"
              paymentSource="jaipong"
              summary={<JaipongPaymentSummary />}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default AdminSideMenu;
