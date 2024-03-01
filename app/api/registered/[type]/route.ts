import { firestore } from "@/lib/firebase";
import {
  FirestoreError,
  collection,
  getAggregateFromServer,
  sum,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { type: string } }
) => {
  const { type } = params;
  const key = type == "atlets" ? "nomorPertandingan" : "nomorTarian";
  return getAggregateFromServer(collection(firestore, type), {
    sum: sum(key),
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
