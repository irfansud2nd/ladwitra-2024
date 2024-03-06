import { authOptions } from "@/lib/authOptions";
import { firestore } from "@/lib/firebase";
import { isAdmin } from "@/utils/admin/adminFunctions";
import {
  FirestoreError,
  and,
  collection,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { slug: string[] } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const userEmail = session.user.email;
  const admin = await isAdmin(userEmail);
  if (!admin)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const { slug } = params;
  const jenis = slug[0];
  const kelas = slug[1];
  const tingkatan = slug[2];
  const kategori = slug[3];
  const jenisKelamin = slug[4] ? [slug[4], slug[4]] : ["Putra", "Putri"];
  const timestamp = slug[5];
  const item = slug[6];

  let result: any = [];
  return getDocs(
    query(
      collection(firestore, "penaris"),
      and(
        where("pertandingan", "array-contains", {
          jenis,
          kelas,
          tingkatan,
          kategori,
        }),
        where("waktuPendaftaran", "<", Number(timestamp)),
        or(
          where("jenisKelamin", "==", jenisKelamin[0]),
          where("jenisKelamin", "==", jenisKelamin[1])
        )
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
