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

const SilatSideMenu = () => {
  const activePath = usePathname().split("/").slice(-1)[0];

  const kontingen = useSelector(
    (state: RootState) => state.kontingen.registered
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
    },
    {
      label: "Kategori Seni",
      href: "seni",
      icon: <FaHandHoldingHand />,
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
    <div className="sm:border-2 rounded-md ml-2 h-full flex-col justify-around p-2 flex">
      <div className="flex flex-col justify-around h-full">
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
      </div>
    </div>
  );
};
export default SilatSideMenu;
