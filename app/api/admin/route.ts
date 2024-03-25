import { isAdmin } from "@/utils/admin/adminFunctions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const email = req.nextUrl.searchParams.get("email");
  const admin = await isAdmin(email as string);

  return NextResponse.json({ result: admin }, { status: 200 });
};
