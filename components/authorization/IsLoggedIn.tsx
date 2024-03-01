import NotLoggedIn from "./NotLoggedIn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const IsLoggedIn = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return <NotLoggedIn />;
  return <>{children}</>;
};
export default IsLoggedIn;
