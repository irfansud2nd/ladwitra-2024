import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email } = await req.json();
  const JWT_SECRET = process.env.JWT_SECRET as string;
  const token = sign({ email, isAdmin: true }, JWT_SECRET);
  return NextResponse.json({ token }, { status: 200 });
};
