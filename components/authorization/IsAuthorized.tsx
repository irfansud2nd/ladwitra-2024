"use client";

import NotLoggedIn from "./NotLoggedIn";
import NotAuthorized from "./NotAuthorized";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import FullLoading from "../loadings/FullLoading";
import { isAdmin } from "@/utils/admin/adminActions";
import { decode } from "jsonwebtoken";

const IsAuthorized = ({ children }: { children: React.ReactNode }) => {
  const [sessionUpdated, setSessionUpdated] = useState(false);

  const { data: session, update } = useSession();
  const updatedSesssion: any = session;
  const authorizedToken = updatedSesssion?.user?.authorizedToken;

  const email = session?.user?.email;

  useEffect(() => {
    if (email && !sessionUpdated) getToken();
  }, []);

  const getToken = async () => {
    const { admin, token } = await isAdmin({
      ignoreJwt: true,
    });
    if (admin) {
      await update({
        ...session,
        user: {
          ...session?.user,
          authorizedToken: token,
        },
      });
    }
    setSessionUpdated(true);
  };

  if (!email) return <NotLoggedIn />;

  if (!sessionUpdated) return <FullLoading text="Memeriksa Akses" />;

  const admin = authorizedToken
    ? (
        decode(authorizedToken) as {
          admin: boolean;
        }
      ).admin
    : false;

  if (!admin) return <NotAuthorized />;

  return <>{children}</>;
};
export default IsAuthorized;
