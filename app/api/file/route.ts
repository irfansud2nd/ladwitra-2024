import { authOptions } from "@/lib/authOptions";
import { storage } from "@/lib/firebase";
import {
  StorageError,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const directory = formData.get("directory") as string;

  return uploadBytes(ref(storage, directory), file)
    .then((snapshot) =>
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        return NextResponse.json(
          { message: "Successfully Uploaded", downloadUrl },
          { status: 200 }
        );
      })
    )
    .catch((error: StorageError) => {
      return NextResponse.json(
        {
          message: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    });
};
