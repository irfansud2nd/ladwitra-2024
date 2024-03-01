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
