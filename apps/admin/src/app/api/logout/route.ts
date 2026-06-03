import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("password");

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("password");

  return NextResponse.json({ success: true });
}
