import type { Post } from "@repo/db/data";
import Link from "next/link";

export function BlogListItem({ post }: { post: Post }) {
  const cleanTitle = post.title.replace(/[^\w\s,]/g, "");

  return (
    <article
      data-testid={`blog-post-${post.id}`}
      data-test-id={`blog-post-${post.id}`}
      className="flex gap-6 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-48 h-48 object-cover rounded-xl flex-shrink-0"
      />


      <div className="flex flex-col flex-1 justify-between">


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

        <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
          {post.description}
        </p>


        <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-500">
          {post.tags.split(",").map((tag) => (
            <span key={tag}>#{tag.trim()}</span>
          ))}
        </div>


        <div className="flex justify-between items-center mt-4 text-sm text-gray-500 border-t pt-3">
          <span>{post.views} views</span>

          <div className="flex items-center gap-1 text-red-500">
            <span aria-hidden="true">❤️</span>
            <span>{post.likes} likes</span>
          </div>
        </div>
      </div>
    </article>
  );
}