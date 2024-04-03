import { authOptions } from "@/lib/authOptions";
import { firestore } from "@/lib/firebase";
import { isAdmin } from "@/utils/admin/adminFunctions";
import { capitalize } from "@/utils/functions";
import {
  FirestoreError,
  and,
  collection,
  deleteDoc,
  doc,
  getAggregateFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  sum,
  updateDoc,
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
  const id = searchParams.get("id");
  const targetEmail = searchParams.get("email");
  const source = searchParams.get("source");
  const status = searchParams.get("status");
  const timestamp = searchParams.get("timestamp");
  const item = searchParams.get("limit");
  const count = searchParams.get("count");

  let exception: any = searchParams.get("exception");
  if (exception) {
    exception = exception.split(",").map((item: string) => Number(item));
  } else {
    exception = [0];
  }

  const confirmed = status
    ? [status == "confirmed", status == "confirmed"]
    : [true, false];

  let searchQuery: any;

  if (count) {
    if (source) searchQuery = where("source", "==", source);

    return getAggregateFromServer(
      query(
        collection(firestore, "payments"),
        searchQuery,
        where("confirmed", "in", confirmed)
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
  }

  if (!targetEmail || targetEmail != userEmail) {
    const admin = await isAdmin(userEmail);
    if (!admin)
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  let noLimit = true;

  searchQuery = where("creatorEmail", "==", targetEmail);

  if (status) {
    searchQuery =
      status == "confirmed"
        ? and(
            where("source", "==", source),
            where("confirmed", "==", status == "confirmed"),
            where("waktuPembayaran", "not-in", exception),
            where("waktuPembayaran", "<", Number(timestamp))
          )
        : where("confirmed", "==", status == "confirmed");
    noLimit = status !== "confirmed";
  }

  if (id) {
    searchQuery = where("id", "==", id);
  }

  let getData = noLimit
    ? getDocs(
        query(
          collection(firestore, "payments"),
          where("source", "==", source),
          searchQuery,
          orderBy("waktuPembayaran", "desc")
        )
      )
    : getDocs(
        query(
          collection(firestore, "payments"),
          searchQuery,
          orderBy("waktuPembayaran", "desc"),
          limit(Number(item))
        )
      );

  let result: any[] = [];

  return getData
    .then((docSnapshot) => {
      docSnapshot.forEach((doc) => {
        result.push(doc.data());
      });
      return NextResponse.json({ result }, { status: 200 });
    })
    .catch((error: FirestoreError) => {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      );
    });
};

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const data = await req.json();

  return setDoc(doc(firestore, "payments", data.id), data)
    .then(() => {
      return NextResponse.json(
        {
          message: `${capitalize("payments", true)} baru berhasil didaftarkan`,
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

export const PATCH = async (req: Request) => {
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

  return updateDoc(doc(firestore, "payments", data.id), data)
    .then((res) => {
      return NextResponse.json(
        {
          message: `${capitalize("payments", true)} berhasil diperbaharui`,
        },
        { status: 200 }
      );
    })
    .catch(({ message, code }: FirestoreError) => {
      return NextResponse.json({ message, code }, { status: 500 });
    });
};

export const DELETE = async (req: NextRequest) => {
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

  console.log({ documentId, targetEmail });
  return deleteDoc(doc(firestore, "payments", documentId))
    .then((res) => {
      return NextResponse.json(
        {
          message: `Pembayaran baru berhasil dihapus`,
        },
        { status: 200 }
      );
    })
    .catch(({ message, code }: FirestoreError) => {
      return NextResponse.json({ message, code }, { status: 500 });
    });
};
