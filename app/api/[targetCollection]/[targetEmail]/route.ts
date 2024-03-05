import {
  FirestoreError,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { isAdmin } from "@/utils/admin/adminFunctions";
import { firestore } from "@/lib/firebase";

export const GET = async (
  req: Request,
  { params }: { params: { targetCollection: string; targetEmail: string } }
) => {
  const { targetCollection, targetEmail } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const userEmail = session.user.email;

  if (userEmail != targetEmail) {
    const admin = await isAdmin(userEmail);
    if (!admin)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  let result: any[] = [];

  return getDocs(
    query(
      collection(firestore, targetCollection),
      where("creatorEmail", "==", targetEmail)
    )
  )
    .then((docSnapshot) => {
      docSnapshot.forEach((doc) => {
        result.push(doc.data());
      });
      return NextResponse.json({ result }, { status: 200 });
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};
