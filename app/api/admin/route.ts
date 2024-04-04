import { isAdmin } from "@/utils/admin/adminFunctions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get("email");
  const ignoreJwt = searchParams.get("ignoreJwt") == "true";
  const admin = await isAdmin(email as string, { ignoreJwt });

  return NextResponse.json({ result: admin }, { status: 200 });
};
