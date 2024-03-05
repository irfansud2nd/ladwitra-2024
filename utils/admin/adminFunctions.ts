import { firestore } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// IS ADMIN
export const isAdmin = async (email: string) => {
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

export const reduceData = (data: any[]) => {
  const reducedData = Object.values(
    data.reduce((acc, obj) => {
      acc[obj.id] = obj;
      return acc;
    }, {} as any)
  );
  return reducedData;
};
