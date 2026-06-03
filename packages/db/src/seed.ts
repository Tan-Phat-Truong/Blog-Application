import { client } from "./client.js";
import { posts } from "./data.js";

export async function seed() {
  console.log("🌱 Seeding data");
  await client.db.like.deleteMany();
  await client.db.comment.deleteMany();
  await client.db.post.deleteMany();
  for (const post of posts) {
    await client.db.post.create({
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        description: post.description,
        imageUrl: post.imageUrl,
        tags: post.tags
          .split(",")
          .map((p: string) => p.trim())
          .join(","),
        urlId: post.urlId,
        active: post.active,
        date: post.date,
        id: post.id,
        views: post.views,
      },
    });
    for (let i = 0; i < post.likes; i++) {
      await client.db.like.create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }
}

/** Seeds base data plus 5 extra active posts (8 total active) to enable pagination testing. */
export async function seedForPagination() {
  await seed();
  for (let i = 0; i < 5; i++) {
    await client.db.post.create({
      data: {
        id: 10 + i,
        title: `Pagination Post ${i + 1}`,
        urlId: `pagination-post-${i + 1}`,
        description: "Test post for pagination testing.",
        content: "Test content for pagination.",
        imageUrl: "https://example.com/image.jpg",
        date: new Date("2024-01-01"),
        category: "Node",
        tags: "Back-End",
        views: 0,
        active: true,
      },
    });
  }
}

