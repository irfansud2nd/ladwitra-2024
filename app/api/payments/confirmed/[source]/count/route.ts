import { firestore } from "@/lib/firebase";
import {
  FirestoreError,
  collection,
  getAggregateFromServer,
  query,
  sum,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { source: string } }
) => {
  const { source } = params;
  return getAggregateFromServer(
    query(
      collection(firestore, "payments"),
      where("confirmed", "==", true),
      where("source", "==", source)
    ),
    {
      sum: sum("totalPembayaran"),
    }
  )
    .then((snapshot) => {
      return NextResponse.json(
        { result: snapshot.data().sum },
        { status: 200 }
      );
    })
    .catch(({ message, code }: FirestoreError) => {
      return NextResponse.json({ message, code }, { status: 500 });
    });
};
