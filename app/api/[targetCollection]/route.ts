import { FirestoreError, doc, setDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
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
