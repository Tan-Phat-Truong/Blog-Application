import { client } from "@repo/db/client";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

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

function mapPosts(posts: DbPostWithLikeCount[]): Post[] {
  return posts.map(mapPost);
}

async function getActivePostsBase(): Promise<DbPostWithLikeCount[]> {
  return client.db.post.findMany({
    where: { active: true },
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
}

export async function getHomePosts(): Promise<Post[]> {
  return mapPosts(await getActivePostsBase());
}

export async function getPostsByCategory(name: string): Promise<Post[]> {
  const posts = await getActivePostsBase();
  const normalized = name.toLowerCase();

  return mapPosts(
    posts.filter((post) => post.category.toLowerCase() === normalized),
  );
}

export async function getPostsByHistory(
  year: string,
  month: string,
): Promise<Post[]> {
  const posts = await getActivePostsBase();

  return mapPosts(
    posts.filter((post) => {
      const date = new Date(post.date);
      return (
        date.getFullYear().toString() === year &&
        (date.getMonth() + 1).toString() === month
      );
    }),
  );
}

export async function getPostsByTag(name: string): Promise<Post[]> {
  const posts = await getActivePostsBase();
  const normalized = name.toLowerCase();

  return mapPosts(
    posts.filter((post) => {
      const tagList = post.tags.split(",").map((tag) => toUrlPath(tag.trim()));
      return tagList.includes(normalized);
    }),
  );
}

export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await getActivePostsBase();
  const normalized = query.toLowerCase();

  return mapPosts(
    posts.filter(
      (post) =>
        post.title.toLowerCase().includes(normalized) ||
        post.description.toLowerCase().includes(normalized),
    ),
  );
}

export async function getSidebarPosts(): Promise<Post[]> {
  return mapPosts(await getActivePostsBase());
}

export async function getPostAndIncreaseViews(urlId: string): Promise<Post | null> {
  try {
    const post = await client.db.post.update({
      where: { urlId },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        _count: {
          select: {
            Likes: true,
          },
        },
      },
    });

    return mapPost(post);
  } catch {
    return null;
  }
}

export async function toggleLikeByIp(
  postId: number,
  userIp: string,
): Promise<number | null> {
  const post = await client.db.post.findUnique({ where: { id: postId } });

  if (!post || !post.active) {
    return null;
  }

  const existingLike = await client.db.like.findUnique({
    where: {
      postId_userIP: {
        postId,
        userIP: userIp,
      },
    },
  });

  if (existingLike) {
    await client.db.like.delete({
      where: {
        postId_userIP: {
          postId,
          userIP: userIp,
        },
      },
    });
  } else {
    await client.db.like.create({
      data: {
        postId,
        userIP: userIp,
      },
    });
  }

  return client.db.like.count({ where: { postId } });
}