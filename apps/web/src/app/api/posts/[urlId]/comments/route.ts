import { NextRequest, NextResponse } from "next/server";
import { client } from "@repo/db/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ urlId: string }> },
) {
  const { urlId } = await params;

  const post = await client.db.post.findUnique({ where: { urlId } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comments = await client.db.comment.findMany({
    where: { postId: post.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, author: true, body: true, createdAt: true },
  });

  return NextResponse.json({ comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ urlId: string }> },
) {
  const { urlId } = await params;
  const body = (await request.json()) as { author?: string; body?: string };

  const author = body.author?.trim();
  const commentBody = body.body?.trim();

  if (!author || !commentBody) {
    return NextResponse.json(
      { error: "author and body are required" },
      { status: 400 },
    );
  }

  if (author.length > 100) {
    return NextResponse.json(
      { error: "author must be 100 characters or fewer" },
      { status: 400 },
    );
  }

  if (commentBody.length > 1000) {
    return NextResponse.json(
      { error: "comment must be 1000 characters or fewer" },
      { status: 400 },
    );
  }

  const post = await client.db.post.findUnique({ where: { urlId } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comment = await client.db.comment.create({
    data: { postId: post.id, author, body: commentBody },
    select: { id: true, author: true, body: true, createdAt: true },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
