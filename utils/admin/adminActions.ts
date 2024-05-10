"use server";

import { authOptions } from "@/lib/authOptions";
import { firestore } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { decode, sign } from "jsonwebtoken";
import { getServerSession } from "next-auth";

export const isAdmin = async (options?: { ignoreJwt?: boolean }) => {
  let result = {
    admin: false,
    token: "",
  };

  const session: any = await getServerSession(authOptions);
  if (!session) return result;

  if (!options?.ignoreJwt) {
    // console.log("CHECK TOKEN");
    const authorizedToken = session?.user?.authorizedToken;
    const data: any = decode(authorizedToken);
    if (!data) return result;
    result.admin = data.admin as boolean;
    result.token = authorizedToken;
    return result;
  }

  // console.log("FETCH IS ADMIN");
  return getDocs(
    query(
      collection(firestore, "admin"),
      where("email", "==", session.user.email)
    )
  ).then((querySnapshot) => {
    if (querySnapshot.empty) {
      return result;
    } else {
      const data = querySnapshot.docs[0].data();
      if (!data) return result;
      const JWT_SECRET = process.env.JWT_SECRET as string;
      const jwt = sign(
        { email: session?.user?.email, admin: true },
        JWT_SECRET
      );
      result.token = jwt;
      result.admin = true;
      return result;
    }
  });
};
