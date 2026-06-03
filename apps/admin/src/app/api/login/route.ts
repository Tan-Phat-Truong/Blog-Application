import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

const PASSWORD = env.PASSWORD;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  if (password !== PASSWORD) {
    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 401 }
    );
  }

  const token = jwt.sign({ role: "admin" }, env.JWT_SECRET, { expiresIn: "7d" });
  const cookieStore = await cookies();

  cookieStore.set("auth_token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ success: true });
}
