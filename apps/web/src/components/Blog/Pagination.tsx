import Link from "next/link";
import type { PaginationInfo } from "@/functions/paginate";

export function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  basePath,
}: PaginationInfo & { basePath: string }) {
  if (totalPages <= 1) return null;

  const sep = basePath.includes("?") ? "&" : "?";

  return (
    <nav
      className="flex items-center justify-between mt-8 border-t border-gray-200 dark:border-gray-700 pt-6"
      aria-label="Pagination"
      data-test-id="pagination"
    >
      {hasPrev ? (
        <Link
          href={`${basePath}${sep}page=${page - 1}`}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          data-test-id="pagination-prev"
        >
          &larr; Previous
        </Link>
      ) : (
        <span
          className="px-4 py-2 text-sm text-gray-300 dark:text-gray-600 border border-gray-200 dark:border-gray-700 rounded-md cursor-not-allowed"
          data-test-id="pagination-prev-disabled"
        >
          &larr; Previous
        </span>
      )}

      <span
        className="text-sm text-gray-500 dark:text-gray-400"
        data-test-id="pagination-info"
      >
        Page {page} of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={`${basePath}${sep}page=${page + 1}`}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          data-test-id="pagination-next"
        >
          Next &rarr;
        </Link>
      ) : (
        <span
          className="px-4 py-2 text-sm text-gray-300 dark:text-gray-600 border border-gray-200 dark:border-gray-700 rounded-md cursor-not-allowed"
          data-test-id="pagination-next-disabled"
        >
          Next &rarr;
        </span>
      )}
    </nav>
  );
}
