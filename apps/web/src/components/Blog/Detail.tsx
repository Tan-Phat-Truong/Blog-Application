import type { Post } from "@repo/db/data";
import Image from "next/image";
import Link from "next/link";
import { marked } from "marked";
import { LikeButton } from "./LikeButton";

/**
 * Strip dangerous HTML tags/attributes from marked output.
 * This runs on the server, so we use a simple regex-based approach
 * rather than a browser-only library (e.g. DOMPurify).
 * It removes <script>, <iframe>, <object>, <embed>, <form> tags and
 * any on* event attributes while preserving safe structural HTML.
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<(object|embed|form|input|button)[^>]*>/gi, "")
    .replace(/\s+on\w+="[^"]*"/gi, "")
    .replace(/\s+on\w+='[^']*'/gi, "")
    .replace(/javascript:[^\s"'>]*/gi, "");
}

export async function BlogDetail({ post, views }: { post: Post; views: number }) {
  const raw = await marked.parse(post.content);
  const content = sanitizeHtml(raw);

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

      <div className="flex justify-center my-4">
        <Image src={post.imageUrl} alt={post.title} width={480} height={270} className="max-w-sm w-full rounded-xl object-cover" />
      </div>

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
