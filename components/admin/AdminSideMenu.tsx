import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const AdminSideMenu = () => {
  const silatMenus = [
    {
      href: "/admin/silat/kontingen",
      label: "Kontingen",
    },
    {
      href: "/admin/silat/official",
      label: "Official",
    },
    {
      href: "/admin/silat/atlet",
      label: "Atlet",
    },
    {
      href: "/admin/silat/atlet/filtered",
      label: "Filtered Atlet",
    },
    {
      href: "/admin/silat/payment",
      label: "Payment",
    },
  ];

  const jaipongMenus = [
    {
      href: "/admin/jaipong/sanggar",
      label: "Sanggar",
    },
  ];

  return (
    <div className="flex flex-col gap-1 sm:border-r-2 h-full w-full sm:w-[150px] p-2">
      <Link href={"/admin"}>Dashboard</Link>
      <Accordion type="single" collapsible>
        <AccordionItem value="silat">
          <AccordionTrigger>Silat</AccordionTrigger>
          {silatMenus.map((menu) => (
            <AccordionContent key={menu.href}>
              <Link href={menu.href}>{menu.label}</Link>
            </AccordionContent>
          ))}
        </AccordionItem>
        <AccordionItem value="jaipong">
          <AccordionTrigger>Jaipong</AccordionTrigger>
          {jaipongMenus.map((menu) => (
            <AccordionContent key={menu.href}>
              <Link href={menu.href}>{menu.label}</Link>
            </AccordionContent>
          ))}
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default AdminSideMenu;
