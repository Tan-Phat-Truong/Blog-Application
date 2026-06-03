import { env } from "@repo/env/admin";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { password?: string };

  if (body.password !== env.PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
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

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("password");

  return NextResponse.json({ success: true });
}