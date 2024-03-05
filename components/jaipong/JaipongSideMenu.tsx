"use client";
import Link from "next/link";
import { MdEmojiPeople } from "react-icons/md";
import { usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { FaMoneyBill1Wave, FaPeopleGroup, FaPerson } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import SanggarInfo from "./sanggar/SanggarInfo";
import SideMenuContainter from "../utils/SideMenuContainter";

const JaipongSideMenu = () => {
  const activePath = usePathname().split("/").slice(-1)[0];

  const sanggar = useSelector((state: RootState) => state.sanggar.registered);
  const registeredPenaris = useSelector(
    (state: RootState) => state.penaris.registered
  );
  const show = useSelector((state: RootState) => state.sideMenu.normal);

  const menus = [
    {
      label: "Penari",
      href: "penari",
      icon: <MdEmojiPeople />,
      length: sanggar?.penaris.length,
    },
    {
      label: "Official",
      href: "official",
      icon: <FaUser />,
      length: sanggar?.koreografers.length,
    },
    {
      label: "Kategori Tunggal",
      href: "tunggal",
      icon: <FaPerson />,
      length: registeredPenaris.filter(
        (penari) => penari.tarian[0].jenis == "Tungal"
      ).length,
    },
    {
      label: "Kategori Rampak",
      href: "rampak",
      icon: <FaPeopleGroup />,
      length: registeredPenaris.filter(
        (penari) => penari.tarian[0].jenis == "Rampak"
      ).length,
    },
    {
      label: "Pembayaran",
      href: "pembayaran",
      icon: <FaMoneyBill1Wave />,
    },
  ];

  return (
    <SideMenuContainter>
      {sanggar?.id && <SanggarInfo show={show} />}
      {menus.map((menu) => (
        <TooltipProvider key={menu.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={menu.href}
                className={`rounded p-2 hover:bg-primary hover:bg_grad_primary transition-all flex items-center
                  ${show && "justify-center"}
                  ${activePath == menu.href && "bg_grad_primary"}`}
              >
                <span className={`*:size-6 ${show && "mr-2"}`}>
                  {menu.icon}
                </span>
                <span
                  className={`transition-all flex-1 ${!show && "text-[0]"}`}
                >
                  {menu.label}
                </span>
                <span>{menu.length && show ? menu.length : null}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent className={`${show && "hidden"}`}>
              <p>{menu.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </SideMenuContainter>
  );
};
export default JaipongSideMenu;
