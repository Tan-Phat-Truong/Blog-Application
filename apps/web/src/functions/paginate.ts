export const POSTS_PER_PAGE = 6;

export interface PaginationInfo {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export function paginate<T>(
  items: T[],
  pageParam: number,
): PaginationInfo & { items: T[] } {
  const totalPages = Math.max(1, Math.ceil(items.length / POSTS_PER_PAGE));
  const page = Math.min(Math.max(1, pageParam), totalPages);
  const start = (page - 1) * POSTS_PER_PAGE;
  return {
    items: items.slice(start, start + POSTS_PER_PAGE),
    page,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
}
