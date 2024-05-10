import { authOptions } from "@/lib/authOptions";
import { firestore } from "@/lib/firebase";
import { isAdmin } from "@/utils/admin/adminActions";
import {
  FirestoreError,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { targetCollection: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const userEmail = session.user.email;
  const { admin } = await isAdmin();
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const { targetCollection } = params;
  const searchParams = req.nextUrl.searchParams;

  const property = searchParams.get("property") as string;
  const keyword = searchParams.get("keyword") as string;

  let result: any = [];
  return getDocs(
    query(
      collection(firestore, targetCollection),
      where(property, "==", keyword)
    )
  )
    .then((docSnapshot) => {
      docSnapshot.forEach((doc) => {
        result.push(doc.data());
      });
      return NextResponse.json({ result }, { status: 200 });
    })
    .catch(({ message, code }: FirestoreError) => {
      return NextResponse.json({ message, code }, { status: 500 });
    });
};
