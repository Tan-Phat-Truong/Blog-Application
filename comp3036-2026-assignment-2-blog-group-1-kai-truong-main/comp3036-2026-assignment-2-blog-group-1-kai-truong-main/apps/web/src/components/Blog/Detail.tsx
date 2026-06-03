import type { Post } from "@repo/db/data";
import Link from "next/link";
import { marked } from "marked";
import { LikeButton } from "./LikeButton";

export async function BlogDetail({ post, views }: { post: Post; views: number }) {
  const content = await marked.parse(post.content);

  return (
    <article data-testid={`blog-post-${post.id}`} data-test-id={`blog-post-${post.id}`}>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>
          {new Date(post.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {post.category}
        </span>
      </div>

      <Link
        href={`/post/${post.urlId}`}
        className="text-xl font-semibold text-blue-900 dark:text-white mt-2 hover:underline"
      >
        {post.title}
      </Link>

      <img src={post.imageUrl} alt={post.title} className="w-full rounded-xl my-4" />

      <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-500">
        {post.tags.split(",").map((tag) => (
          <span key={tag}>#{tag.trim()}</span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-500 border-t pt-3">
        <span>{views} views</span>
        <LikeButton postId={post.id} initialLikes={post.likes} />
      </div>

      <div data-testid="content-markdown" data-test-id="content-markdown"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
