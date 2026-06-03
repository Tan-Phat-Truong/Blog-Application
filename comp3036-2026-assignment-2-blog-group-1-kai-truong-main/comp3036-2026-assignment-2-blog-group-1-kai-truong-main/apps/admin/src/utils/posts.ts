import { client } from "@repo/db/client";
import type { Post } from "@repo/db/data";

type DbPostWithLikeCount = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  tags: string;
  active: boolean;
  _count: {
    Likes: number;
  };
};

function mapPost(post: DbPostWithLikeCount): Post {
  return {
    id: post.id,
    urlId: post.urlId,
    title: post.title,
    content: post.content,
    description: post.description,
    imageUrl: post.imageUrl,
    date: post.date,
    category: post.category,
    views: post.views,
    likes: post._count.Likes,
    tags: post.tags,
    active: post.active,
  };
}

export async function getAdminPosts(): Promise<Post[]> {
  const posts = await client.db.post.findMany({
    include: {
      _count: {
        select: {
          Likes: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return posts.map(mapPost);
}

export async function getAdminPostByUrlId(urlId: string): Promise<Post | null> {
  const post = await client.db.post.findUnique({
    where: { urlId },
    include: {
      _count: {
        select: {
          Likes: true,
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  return mapPost(post);
}