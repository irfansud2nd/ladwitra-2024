import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import SilatPaymentSummary from "./payment/silat/SilatPaymentSummary";

type Menus = {
  label?: string;
  href?: string;
  menus?: Menus;
  prefix?: string;
  component?: JSX.Element;
}[];

const AdminSideMenu = () => {
  const atletMenus: Menus = [
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
  ];
  const penariMenus: Menus = [
    {
      href: "",
      label: "All",
    },
    {
      href: "filtered",
      label: "Filter Kategori",
    },
    {
      href: "filtered",
      label: "Jumlah Per Kategori",
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
    },
    {
      href: "official",
      label: "Official",
    },
    {
      label: "Atlet",
      prefix: "/admin/silat/atlet/",
      menus: atletMenus,
    },
    {
      label: "Pembayaran",
      prefix: "/admin/silat/payment/",
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
      prefix: "/admin/jaipong/penari/",
      menus: penariMenus,
    },
    {
      label: "Pembayaran",
      prefix: "/admin/jaipong/payment/",
      menus: paymentMenus,
    },
  ];

  return (
    <div className="flex flex-col gap-1 sm:border-r-2 h-full w-full sm:w-[170px] p-2">
      <Link href={"/admin"}>Dashboard</Link>
      <Accordion type="single" collapsible>
        <AccordionItem value="silat">
          <AccordionTrigger>Silat</AccordionTrigger>
          {silatMenus.map((menu) => {
            if (menu.menus) {
              return (
                <AccordionContent className="pb-0" key={menu.label}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="atlet" className="border-0">
                      <AccordionTrigger className="pt-0 font-normal">
                        {menu.label}
                      </AccordionTrigger>
                      {menu.menus.map((childMenu) => {
                        if (childMenu.component) {
                          return (
                            <AccordionContent
                              key={childMenu.href}
                              className="ml-2"
                            >
                              {childMenu.component}
                            </AccordionContent>
                          );
                        } else {
                          return (
                            <AccordionContent
                              key={childMenu.href}
                              className="ml-2"
                            >
                              <Link href={`${menu.prefix}${childMenu.href}`}>
                                {childMenu.label}
                              </Link>
                            </AccordionContent>
                          );
                        }
                      })}
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              );
            }
            return (
              <AccordionContent key={menu.href}>
                <Link href={`/admin/silat/${menu.href}`}>{menu.label}</Link>
              </AccordionContent>
            );
          })}
        </AccordionItem>
        <AccordionItem value="jaipong">
          <AccordionTrigger>Jaipong</AccordionTrigger>
          {jaipongMenus.map((menu) => {
            if (menu.menus) {
              return (
                <AccordionContent className="pb-0" key={menu.label}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="atlet" className="border-0">
                      <AccordionTrigger className="pt-0 font-normal">
                        {menu.label}
                      </AccordionTrigger>
                      {menu.menus.map((childMenu) => {
                        if (childMenu.component) {
                          return (
                            <AccordionContent
                              key={childMenu.href}
                              className="ml-2"
                            >
                              {childMenu.component}
                            </AccordionContent>
                          );
                        } else {
                          return (
                            <AccordionContent
                              key={childMenu.href}
                              className="ml-2"
                            >
                              <Link href={`${menu.prefix}${childMenu.href}`}>
                                {childMenu.label}
                              </Link>
                            </AccordionContent>
                          );
                        }
                      })}
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              );
            }
            return (
              <AccordionContent key={menu.href}>
                <Link href={`/admin/silat/${menu.href}`}>{menu.label}</Link>
              </AccordionContent>
            );
          })}
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default AdminSideMenu;
