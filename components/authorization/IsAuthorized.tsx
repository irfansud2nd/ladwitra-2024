import NotLoggedIn from "./NotLoggedIn";
import { isAdmin } from "@/utils/admin/adminFunctions";
import NotAuthorized from "./NotAuthorized";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const IsAuthorized = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return <NotLoggedIn />;

  const admin = await isAdmin(email);

  if (!admin) return <NotAuthorized />;

  return <>{children}</>;
};
export default IsAuthorized;
