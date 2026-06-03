import { NextRequest, NextResponse } from "next/server";
import { toggleLikeByIp } from "@/functions/postQueries";

function getRequestIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    return firstIp?.trim() || "127.0.0.1";
  }

  return "127.0.0.1";
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { postId?: number };

  if (!body.postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  const likes = await toggleLikeByIp(body.postId, getRequestIp(request));

  if (likes === null) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ likes });
}