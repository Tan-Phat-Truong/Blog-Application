import { client } from "@repo/db/client";
import { toUrlPath } from "@repo/utils/url";
import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "../../../utils/auth";

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

async function getUniqueUrlId(baseTitle: string): Promise<string> {
  const baseUrlId = toUrlPath(baseTitle) || "post";
  let urlId = baseUrlId;
  let index = 1;

  while (await client.db.post.findUnique({ where: { urlId } })) {
    urlId = `${baseUrlId}-${index}`;
    index += 1;
  }

  return urlId;
}

export async function POST(request: NextRequest) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as PostPayload;
  const validationError = validate(payload);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const post = await client.db.post.create({
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
      category: payload.category?.trim() || "General",
      urlId: await getUniqueUrlId(payload.title!.trim()),
      active: true,
      views: 0,
    },
  });

  return NextResponse.json({ success: true, post });
}