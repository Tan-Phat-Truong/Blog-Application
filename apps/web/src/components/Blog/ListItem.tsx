import type { Post } from "@repo/db/data";
import Image from "next/image";
import Link from "next/link";

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article
      data-testid={`blog-post-${post.id}`}
      data-test-id={`blog-post-${post.id}`}
      className="flex gap-6 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      <Image
        src={post.imageUrl}
        alt={post.title}
        width={192}
        height={192}
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
            <span>{post.likes} likes</span>
          </div>
        </div>
      </div>
    </article>
  );
}