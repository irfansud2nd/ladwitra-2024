import { authOptions } from "@/lib/authOptions";
import { firestore } from "@/lib/firebase";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import { decode } from "jsonwebtoken";
import { getServerSession } from "next-auth";

// IS ADMIN
export const isAdmin = async (email: string, clientSide: boolean = false) => {
  if (clientSide) {
    return axios
      .get(`/api/admin?email=${email}`)
      .then((res) => {
        return res.data.result as boolean;
      })
      .catch((error) => {
        return false;
      });
  }

  const session: any = await getServerSession(authOptions);
  const token = session?.user?.adminToken;
  if (token) {
    const data: any = decode(token);
    return data.isAdmin;
  }

  return getDocs(
    query(collection(firestore, "admin"), where("email", "==", email))
  ).then((querySnapshot) => {
    if (querySnapshot.empty) {
      return false;
    } else {
      const data = querySnapshot.docs[0].data();
      return data ? true : false;
    }
  });
};

export const signAdminToken = async (email: string) => {
  const res = await axios.post("/api/admin/jwt", {
    email,
  });
  return res.data.token;
};

export const reduceData = (data: any[]) => {
  const reducedData = Object.values(
    data.reduce((acc, obj) => {
      acc[obj.id] = obj;
      return acc;
    }, {} as any)
  );
  return reducedData;
};
