import { authOptions } from "@/lib/authOptions";
import { firestore } from "@/lib/firebase";
import { isAdmin } from "@/utils/admin/adminFunctions";
import { getTarianId } from "@/utils/jaipong/penari/penariFunctions";
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
  const jenis = searchParams.get("jenis") as string;
  const kelas = searchParams.get("kelas") as string;
  const tingkatan = searchParams.get("tingkatan") as string;
  const kategori = searchParams.get("kategori") as string;
  const lagu = searchParams.get("lagu");
  const jenisKelamin = searchParams.get("jenisKelamin")
    ? [searchParams.get("jenisKelamin"), searchParams.get("jenisKelamin")]
    : ["Putra", "Putri"];
  const timestamp = searchParams.get("timestamp");
  const item = searchParams.get("limit");
  const count = searchParams.get("count");

  let searchQuery: any = where("tarian", "array-contains", {
    jenis,
    kelas,
    tingkatan,
    kategori,
  });

  //   if (lagu) {
  //     searchQuery = and(
  //       where("tarian", "array-contains", {
  //         jenis,
  //         kelas,
  //         tingkatan,
  //         kategori,
  //       }),
  //       where("lagu", "array-contains", {
  //         id: getTarianId({ jenis, kelas, tingkatan, kategori }),
  //         lagu: lagu,
  //       })
  //     );
  //   }

  if (count) {
    return getCountFromServer(
      query(
        collection(firestore, "penaris"),
        and(searchQuery, where("jenisKelamin", "==", jenisKelamin[0]))
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
      collection(firestore, "penaris"),
      and(
        searchQuery,
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
