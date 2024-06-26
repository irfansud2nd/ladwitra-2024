"use client";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { MdMenu } from "react-icons/md";
import SilatSideMenu from "../silat/SilatSideMenu";
import ReduxProvider from "../utils/ReduxProvider";
import ThemeSwitcher from "../header/ThemeSwitcher";
import { usePathname } from "next/navigation";
import AdminSideMenu from "../admin/AdminSideMenu";
import { useSession } from "next-auth/react";
import JaipongSideMenu from "../jaipong/JaipongSideMenu";

const MobileSideMenu = () => {
  const session = useSession();
  const email = session.data?.user?.email;
  const pathnames = usePathname().split("/");
  const page = pathnames[1];
  return (
    <Sheet>
      <SheetTrigger asChild className={`sm:hidden ${!email && "hidden"}`}>
        <Button variant="ghost" size={"icon"}>
          <MdMenu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="px-0 grid grid-rows-[auto_1fr]">
        <div className="flex justify-between items-center px-5 border-b mt-4">
          <h1>Menu</h1>
          <ThemeSwitcher />
        </div>
        {(page == "silat" || page == "jaipong" || page == "admin") && (
          <ReduxProvider>
            {page == "silat" ? (
              <SilatSideMenu />
            ) : page == "jaipong" ? (
              <JaipongSideMenu />
            ) : (
              page == "admin" && <AdminSideMenu />
            )}
          </ReduxProvider>
        )}
      </SheetContent>
    </Sheet>
  );
};
export default MobileSideMenu;
