import { authOptions } from "@/lib/authOptions";
import { firestore } from "@/lib/firebase";
import { isAdmin } from "@/utils/admin/adminFunctions";
import { AtletState } from "@/utils/silat/atlet/atletConstats";
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
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { slug: string[] } }
) => {
  const { slug } = params;
  const jenis = slug[0];
  const tingkatan = slug[1];
  const kategori = slug[2];
  const jenisKelamin = slug[3];

  return getCountFromServer(
    query(
      collection(firestore, "atlets"),
      where("pertandingan", "array-contains", { jenis, tingkatan, kategori }),
      where("jenisKelamin", "==", jenisKelamin)
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
};
