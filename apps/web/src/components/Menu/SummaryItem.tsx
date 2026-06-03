import Link from "next/link";
import type { ReactNode } from "react";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
  showCount = true,
  icon,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
  showCount?: boolean;
  icon?: ReactNode;
}) {
  return (
    <li>
      <Link
        href={link}
        title={title}
        className={`flex items-center gap-3 px-2 py-2 text-sm font-medium ${
          isSelected ? "selected text-wsu" : "text-gray-800 dark:text-gray-200"
        }`}
      >
        {showCount ? (
          <span
            data-testid="post-count"
            data-test-id="post-count"
            className="inline-flex items-center justify-center w-5 h-5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded flex-shrink-0"
          >
            {count}
          </span>
        ) : (
          <>
            {icon && (
              <span className="w-5 h-5 text-gray-400 flex-shrink-0 flex items-center justify-center">
                {icon}
              </span>
            )}
            <span
              data-testid="post-count"
              data-test-id="post-count"
              className="sr-only"
            >
              {count}
            </span>
          </>
        )}
        <span>{name}</span>
      </Link>
    </li>
  );
}