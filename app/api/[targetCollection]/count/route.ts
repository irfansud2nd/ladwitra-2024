import { firestore } from "@/lib/firebase";
import {
  FirestoreError,
  collection,
  getCountFromServer,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { targetCollection: string } }
) => {
  const { targetCollection } = params;
  return getCountFromServer(collection(firestore, targetCollection))
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
