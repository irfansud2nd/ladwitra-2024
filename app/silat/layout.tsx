import IsLoggedIn from "@/components/authorization/IsLoggedIn";
import GetUserSilatData from "@/components/silat/GetUserSilatData";
import SilatSideMenu from "@/components/silat/SilatSideMenu";
import ToggleSideMenu from "@/components/silat/ToggleSideMenu";
import Container from "@/components/ui/container";
import ReduxProvider from "@/components/utils/ReduxProvider";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Pendaftaran Silat - Ladwitra",
  description: "Informasi dan Pendaftaran Silat Ladwitra Championship 2024",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return notFound();
  return (
    <Container>
      <IsLoggedIn>
        <div className="h-full w-full max-h-[calc(100vh-65px)] grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-2 p-2">
          <ReduxProvider>
            <div className="hidden sm:block">
              <SilatSideMenu />
            </div>
            <div
              className={`w-full max-h-full sm:border-2 rounded-md sm:p-2 overflow-auto`}
            >
              <GetUserSilatData>
                <div className="hidden sm:block">
                  <ToggleSideMenu />
                </div>
                {children}
              </GetUserSilatData>
            </div>
          </ReduxProvider>
        </div>
      </IsLoggedIn>
    </Container>
  );
};
export default layout;
