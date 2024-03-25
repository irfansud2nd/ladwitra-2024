import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email } = await req.json();
  const token = sign(
    { email, isAdmin: true },
    process.env.JWT_SECRET as string
  );
  return NextResponse.json({ token }, { status: 200 });
};
