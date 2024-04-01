import {
  FirestoreError,
  and,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { firestore } from "@/lib/firebase";
import { authOptions } from "@/lib/authOptions";
import { isAdmin } from "@/utils/admin/adminFunctions";
import { capitalize } from "@/utils/functions";

export const POST = async (
  req: Request,
  { params }: { params: { targetCollection: string } }
) => {
  const { targetCollection } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const data = await req.json();

  return setDoc(doc(firestore, targetCollection, data.id), data)
    .then(() => {
      return NextResponse.json(
        {
          message: `${capitalize(
            targetCollection,
            true
          )} baru berhasil didaftarkan`,
        },
        {
          status: 200,
        }
      );
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};

export const PATCH = async (
  req: Request,
  { params }: { params: { targetCollection: string } }
) => {
  const { targetCollection } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const data = await req.json();
  const userEmail = session.user.email;

  if (userEmail != data.creatorEmail) {
    const admin = await isAdmin(userEmail);
    if (!admin)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  return updateDoc(doc(firestore, targetCollection, data.id), data)
    .then((res) => {
      return NextResponse.json(
        {
          message: `${capitalize(
            targetCollection,
            true
          )} berhasil diperbaharui`,
        },
        { status: 200 }
      );
    })
    .catch(({ message, code }: FirestoreError) => {
      return NextResponse.json({ message, code }, { status: 500 });
    });
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { targetCollection: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const userEmail = session.user.email;

  const { targetCollection } = params;

  const searchParams = req.nextUrl.searchParams;

  const idKontingen = searchParams.get("idKontingen");
  const idPembayaran = searchParams.get("idPembayaran");
  const targetEmail = searchParams.get("email");
  const id = searchParams.get("id");
  const timestamp = searchParams.get("timestamp");
  let item = searchParams.get("limit");
  let exception: any = searchParams.get("exception");
  if (exception) {
    exception = exception.split(",").map((item: string) => Number(item));
  } else {
    exception = [0];
  }

  let result: any = [];

  let searchQuery: any = and(
    where("waktuPendaftaran", "not-in", exception),
    where("waktuPendaftaran", "<", Number(timestamp))
  );

  let noLimit = false;

  if (idKontingen) searchQuery = where("idKontingen", "==", idKontingen);

  if (id) searchQuery = where("id", "==", id);

  if (targetEmail) {
    searchQuery = where("creatorEmail", "==", targetEmail);
    noLimit = true;
  }

  if (idPembayaran) {
    searchQuery = where("idPembayaran", "array-contains", idPembayaran);
    noLimit = true;
  }

  if (!targetEmail || targetEmail != userEmail) {
    const admin = await isAdmin(userEmail);
    if (!admin)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  let getData = noLimit
    ? getDocs(query(collection(firestore, targetCollection), searchQuery))
    : getDocs(
        query(
          collection(firestore, targetCollection),
          searchQuery,
          orderBy("waktuPendaftaran", "desc"),
          limit(Number(item))
        )
      );

  return getData
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

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { targetCollection: string } }
) => {
  const { targetCollection } = params;

  const searchParams = req.nextUrl.searchParams;

  const targetEmail = searchParams.get("email") as string;
  const documentId = searchParams.get("id") as string;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const userEmail = session.user.email;

  if (userEmail != targetEmail) {
    const admin = await isAdmin(userEmail);
    if (!admin)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }
  return deleteDoc(doc(firestore, targetCollection, documentId))
    .then((res) => {
      return NextResponse.json(
        {
          message: `${
            targetCollection.charAt(0).toUpperCase() +
            targetCollection.slice(1, targetCollection.length - 1)
          } baru berhasil didaftarkan`,
        },
        { status: 200 }
      );
    })
    .catch(({ message, code }: FirestoreError) => {
      return NextResponse.json({ message, code }, { status: 500 });
    });
};
