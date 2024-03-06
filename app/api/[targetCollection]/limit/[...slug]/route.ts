import { authOptions } from "@/lib/authOptions";
import { firestore } from "@/lib/firebase";
import { isAdmin } from "@/utils/admin/adminFunctions";
import { AtletState } from "@/utils/silat/atlet/atletConstats";
import {
  FirestoreError,
  and,
  collection,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { slug: string[]; targetCollection: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const userEmail = session.user.email;
  const admin = await isAdmin(userEmail);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const { slug, targetCollection } = params;
  const timestamp = slug[0];
  const item = slug[1];
  let exeception: number[] = [0];
  if (slug.slice(2).length)
    exeception = slug.slice(2).map((item) => Number(item));

  let result: any = [];
  return getDocs(
    query(
      collection(firestore, targetCollection),
      and(
        where("waktuPendaftaran", "not-in", exeception),
        where("waktuPendaftaran", "<", Number(timestamp))
      ),
      orderBy("waktuPendaftaran", "desc"),
      limit(Number(item))
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
