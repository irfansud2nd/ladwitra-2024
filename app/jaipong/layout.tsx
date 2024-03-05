import IsLoggedIn from "@/components/authorization/IsLoggedIn";
import GetUserJaipongData from "@/components/jaipong/GetUserJaipongData";
import JaipongSideMenu from "@/components/jaipong/JaipongSideMenu";
import ToggleSideMenu from "@/components/silat/ToggleSideMenu";
import Container from "@/components/ui/container";
import ReduxProvider from "@/components/utils/ReduxProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran Jaipong - Ladwitra",
  description: "Informasi dan Pendaftaran Jaipong Ladwitra Championship 2024",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <IsLoggedIn>
        <div className="h-full w-full max-h-[calc(100vh-65px)] grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-2 p-2">
          <ReduxProvider>
            <div className="hidden sm:block">
              <JaipongSideMenu />
            </div>
            <div
              className={`w-full max-h-full sm:border-2 rounded-md sm:p-2 overflow-auto`}
            >
              <GetUserJaipongData>
                <div className="hidden sm:block">
                  <ToggleSideMenu />
                </div>
                {children}
              </GetUserJaipongData>
            </div>
          </ReduxProvider>
        </div>
      </IsLoggedIn>
    </Container>
  );
};
export default layout;
