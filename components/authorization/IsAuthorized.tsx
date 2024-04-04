"use client";

import NotLoggedIn from "./NotLoggedIn";
import { isAdmin, signAdminToken } from "@/utils/admin/adminFunctions";
import NotAuthorized from "./NotAuthorized";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FullLoading from "../loadings/FullLoading";

const IsAuthorized = ({ children }: { children: React.ReactNode }) => {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const { data: session, update } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (email && !authorized) {
      checkAuthorized();
    }
  }, []);

  const checkAuthorized = async () => {
    setLoading(true);
    if (!email) return;
    const updatedSession: any = session;
    if (!updatedSession?.user?.isAdmin) {
      const admin = await isAdmin(email, { clientSide: true, ignoreJwt: true });
      if (admin) {
        setAuthorized(true);
        const token = await signAdminToken(email);
        await update({
          ...session,
          user: {
            ...session?.user,
            adminToken: token,
          },
        });
      }
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  };

  if (!email) return <NotLoggedIn />;

  if (loading) return <FullLoading text="Memeriksa Akses" />;

  if (!authorized) return <NotAuthorized />;

  return <>{children}</>;
};
export default IsAuthorized;

// import NotLoggedIn from "./NotLoggedIn";
// import { isAdmin } from "@/utils/admin/adminFunctions";
// import NotAuthorized from "./NotAuthorized";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";

// const IsAuthorized = async ({ children }: { children: React.ReactNode }) => {
//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;

//   if (!email) return <NotLoggedIn />;

//   const admin = await isAdmin(email);

//   if (!admin) return <NotAuthorized />;

//   return <>{children}</>;
// };
// export default IsAuthorized;
