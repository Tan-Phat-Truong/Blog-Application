import { client } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../../../utils/auth";

type PostPayload = {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  tags?: string;
  category?: string;
};

function validate(payload: PostPayload): string | null {
  if (!payload.title?.trim()) return "Title is required";
  if (!payload.description?.trim()) return "Description is required";
  if (payload.description.length > 200) {
    return "Description is too long. Maximum is 200 characters";
  }
  if (!payload.content?.trim()) return "Content is required";
  if (!payload.imageUrl?.trim()) return "Image URL is required";
  if (!payload.tags?.trim()) return "At least one tag is required";

  try {
    new URL(payload.imageUrl);
  } catch {
    return "This is not a valid URL";
  }

  return null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ urlId: string }> },
) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { urlId } = await params;
  const payload = (await request.json()) as PostPayload;
  const validationError = validate(payload);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const existingPost = await client.db.post.findUnique({ where: { urlId } });
  if (!existingPost) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const post = await client.db.post.update({
    where: { urlId },
    data: {
      title: payload.title!.trim(),
      description: payload.description!.trim(),
      content: payload.content!.trim(),
      imageUrl: payload.imageUrl!.trim(),
      tags: payload.tags!
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .join(","),
      category: payload.category?.trim() || existingPost.category,
    },
  });

  return NextResponse.json({ success: true, post });
}