import { authOptions } from "@/lib/authOptions";
import { isAdmin } from "@/utils/admin/adminFunctions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email)
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  return isAdmin(email).then((res) => {
    if (res) {
      return NextResponse.json({ result: true }, { status: 200 });
    } else {
      return NextResponse.json({ result: false }, { status: 500 });
    }
  });
};
