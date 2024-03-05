"use client";
import Link from "next/link";
import { MdOutlineSportsMartialArts } from "react-icons/md";
import { usePathname } from "next/navigation";
import { FaFistRaised, FaThList, FaUser } from "react-icons/fa";
import { FaHandHoldingHand, FaMedal, FaMoneyBill1Wave } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/redux/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import KontingenInfo from "./kontingen/KontingenInfo";
import SideMenuContainter from "../utils/SideMenuContainter";

const SilatSideMenu = () => {
  const activePath = usePathname().split("/").slice(-1)[0];

  const kontingen = useSelector(
    (state: RootState) => state.kontingen.registered
  );
  const registerdAtlets = useSelector(
    (state: RootState) => state.atlets.registered
  );
  const show = useSelector((state: RootState) => state.sideMenu.normal);

  const menus = [
    {
      label: "Atlet",
      href: "atlet",
      icon: <MdOutlineSportsMartialArts />,
      length: kontingen?.atlets.length,
    },
    {
      label: "Official",
      href: "official",
      icon: <FaUser />,
      length: kontingen?.officials.length,
    },
    {
      label: "Kategori Tanding",
      href: "tanding",
      icon: <FaFistRaised />,
      length: registerdAtlets.filter(
        (atlet) => atlet.pertandingan[0].jenis == "Tanding"
      ).length,
    },
    {
      label: "Kategori Seni",
      href: "seni",
      icon: <FaHandHoldingHand />,
      length: registerdAtlets.filter(
        (atlet) => atlet.pertandingan[0].jenis == "Seni"
      ).length,
    },

    {
      label: "Pembayaran",
      href: "pembayaran",
      icon: <FaMoneyBill1Wave />,
    },
    {
      label: "Jadwal Pertandingan",
      href: "pertandingan",
      icon: <FaThList />,
    },
    {
      label: "Perolehan Medali",
      href: "medali",
      icon: <FaMedal />,
    },
  ];

  return (
    <SideMenuContainter>
      {kontingen?.id && <KontingenInfo show={show} />}
      {menus.map((menu) => (
        <TooltipProvider key={menu.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/silat/${menu.href}`}
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
export default SilatSideMenu;
