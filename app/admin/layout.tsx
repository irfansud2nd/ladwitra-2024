import AdminSideMenu from "@/components/admin/AdminSideMenu";
import IsAuthorized from "@/components/authorization/IsAuthorized";
import Container from "@/components/ui/container";
import ReduxProvider from "@/components/utils/ReduxProvider";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <IsAuthorized>
        <div className="h-full w-full max-h-[calc(100vh-65px)] grid grid-cols-1 sm:grid-cols-[auto_1fr]">
          <ReduxProvider>
            <div className="hidden sm:block">
              <AdminSideMenu />
            </div>
            <div className={`w-full max-h-full rounded-md overflow-auto p-2`}>
              {children}
            </div>
          </ReduxProvider>
        </div>
      </IsAuthorized>
    </Container>
  );
};
export default layout;
