import { authOptions } from "@/lib/authOptions";
import { firestore } from "@/lib/firebase";
import { isAdmin } from "@/utils/admin/adminFunctions";
import {
  FirestoreError,
  and,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const userEmail = session.user.email;

  const searchParams = req.nextUrl.searchParams;
  const jenis = searchParams.get("jenis");
  const tingkatan = searchParams.get("tingkatan");
  const kategori = searchParams.get("kategori");
  const jenisKelamin = searchParams.get("jenisKelamin")
    ? [searchParams.get("jenisKelamin"), searchParams.get("jenisKelamin")]
    : ["Putra", "Putri"];
  const timestamp = searchParams.get("timestamp");
  const item = searchParams.get("limit");
  const count = searchParams.get("count");

  if (count) {
    return getCountFromServer(
      query(
        collection(firestore, "atlets"),
        where("pertandingan", "array-contains", { jenis, tingkatan, kategori }),
        where("jenisKelamin", "==", jenisKelamin[0])
      )
    )
      .then((snapshot) => {
        return NextResponse.json(
          { result: snapshot.data().count },
          { status: 200 }
        );
      })
      .catch(({ message, code }: FirestoreError) => {
        return NextResponse.json({ message, code }, { status: 500 });
      });
  }

  const admin = await isAdmin(userEmail);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  let result: any = [];

  return getDocs(
    query(
      collection(firestore, "atlets"),
      and(
        where("pertandingan", "array-contains", { jenis, tingkatan, kategori }),
        where("waktuPendaftaran", "<", Number(timestamp)),
        where("jenisKelamin", "in", jenisKelamin)
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
