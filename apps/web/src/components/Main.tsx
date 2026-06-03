import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";
import { Pagination } from "./Blog/Pagination";
import type { PaginationInfo } from "../functions/paginate";

export function Main({
  posts,
  className,
  heading,
  subheading,
  pagination,
  basePath,
}: {
  posts: Post[];
  className?: string;
  heading?: string;
  subheading?: string;
  pagination?: PaginationInfo;
  basePath?: string;
}) {
  return (
    <main className={className}>
      {heading && (
        <div className="mb-8 mt-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {heading}
          </h1>
          {subheading && (
            <p className="mt-2 text-gray-500 dark:text-gray-400">{subheading}</p>
          )}
        </div>
      )}
      <BlogList posts={posts} />
      {pagination && basePath && (
        <Pagination {...pagination} basePath={basePath} />
      )}
    </main>
  );
}
