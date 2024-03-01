import { authOptions } from "@/lib/authOptions";
import { storage } from "@/lib/firebase";
import { StorageError, deleteObject, ref } from "firebase/storage";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { directory: string[] } }
) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const directory = params.directory.join("/");

  return deleteObject(ref(storage, directory))
    .then(() =>
      NextResponse.json({ message: "Successfully Deleted" }, { status: 200 })
    )
    .catch((error: StorageError) =>
      NextResponse.json(
        { message: error.message, code: error.code },
        { status: 500 }
      )
    );
};
