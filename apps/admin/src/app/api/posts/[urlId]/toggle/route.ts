import { client } from "@repo/db/client";
import { NextResponse } from "next/server";
import { isLoggedIn } from "../../../../../utils/auth";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ urlId: string }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { urlId } = await params;

  const existingPost = await client.db.post.findUnique({ where: { urlId } });
  if (!existingPost) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const updatedPost = await client.db.post.update({
    where: { urlId },
    data: { active: !existingPost.active },
  });

  return NextResponse.json({ success: true, active: updatedPost.active });
}