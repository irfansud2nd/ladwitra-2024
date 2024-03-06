import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import SilatPaymentSummary from "./payment/silat/SilatPaymentSummary";

type Menus = {
  label: string;
  menus?: Menus;
  href?: string;
  prefix?: string;
  component?: JSX.Element;
}[];

const AdminSideMenu = () => {
  const pesertaMenus: Menus = [
    {
      href: "",
      label: "All",
    },
    {
      href: "filtered",
      label: "Filter Kategori",
    },
    {
      href: "categorized",
      label: "Jumlah Per Kategori",
    },
    {
      href: "search",
      label: "Cari",
    },
  ];

  const basicMenus: Menus = [
    {
      href: "",
      label: "All",
    },
    {
      href: "search",
      label: "Cari",
    },
  ];

  const paymentMenus: Menus = [
    {
      href: "unconfirmed",
      label: "Menunggu Konfirmasi",
    },
    {
      href: "confirmed",
      label: "Sudah Dikonfirmasi",
    },
    {
      label: "",
      href: "",
      component: <SilatPaymentSummary />,
    },
  ];

  const silatMenus: Menus = [
    {
      href: "kontingen",
      label: "Kontingen",
      prefix: "kontingen/",
      menus: basicMenus,
    },
    {
      href: "official",
      label: "Official",
      prefix: "official/",
      menus: basicMenus,
    },
    {
      label: "Atlet",
      prefix: "atlet/",
      menus: pesertaMenus,
    },
    {
      label: "Pembayaran",
      prefix: "payment/",
      menus: paymentMenus,
    },
  ];

  const jaipongMenus: Menus = [
    {
      href: "sanggar",
      label: "Sanggar",
    },
    {
      href: "koreografer",
      label: "Koreografer",
    },
    {
      label: "Penari",
      prefix: "penari/",
      menus: pesertaMenus,
    },
    {
      label: "Pembayaran",
      prefix: "payment/",
      menus: paymentMenus,
    },
  ];

  const menus: Menus = [
    {
      label: "Silat",
      prefix: "/admin/silat/",
      menus: silatMenus,
    },
    {
      label: "Jaipong",
      prefix: "/admin/jaipong/",
      menus: jaipongMenus,
    },
  ];

  return (
    <div className="flex flex-col gap-1 sm:border-r-2 h-full w-full sm:w-[170px] p-2">
      <Accordion type="single" collapsible>
        {menus.map((menu) => (
          <AccordionItem value={menu.label}>
            <AccordionTrigger>{menu.label}</AccordionTrigger>
            <AccordionContent className="pb-0">
              <Accordion type="single" collapsible className="ml-1">
                {menu.menus &&
                  menu.menus.map((level1) => (
                    <AccordionItem
                      value={level1.label}
                      key={level1.label}
                      className="border-0"
                    >
                      <AccordionTrigger className="pt-0 font-normal">
                        {level1.label}
                      </AccordionTrigger>
                      {level1.menus &&
                        level1.menus.map((level2) =>
                          level2.component ? (
                            <AccordionContent
                              key={level2.href}
                              className="ml-1"
                            >
                              {level2.component}
                            </AccordionContent>
                          ) : (
                            <AccordionContent
                              key={level2.href}
                              className="ml-2"
                            >
                              <Link
                                href={`${menu.prefix}${level1.prefix}${level2.href}`}
                              >
                                {level2.label}
                              </Link>
                            </AccordionContent>
                          )
                        )}
                    </AccordionItem>
                  ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
export default AdminSideMenu;
