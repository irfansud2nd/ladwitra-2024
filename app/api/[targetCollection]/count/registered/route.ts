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
  { params }: { params: { targetCollection: string } }
) => {
  const { targetCollection } = params;

  const property =
    targetCollection == "atlets" ? "nomorPertandingan" : "nomorTarian";

  return getAggregateFromServer(collection(firestore, targetCollection), {
    sum: sum(property),
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
