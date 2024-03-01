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

export const GET = async (req: Request) => {
  return getAggregateFromServer(collection(firestore, "payments"), {
    sum: sum("totalPembayaran"),
  })
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
