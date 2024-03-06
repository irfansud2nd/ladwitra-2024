import { firestore } from "@/lib/firebase";
import {
  FirestoreError,
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
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
