import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { searchPosts } from "@/functions/postQueries";
import { paginate } from "@/functions/paginate";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page ?? "1") || 1);
  const allPosts = await searchPosts(q ?? "");
  const { items: posts, ...paginationInfo } = paginate(allPosts, pageNum);
  const basePath = q ? `/search?q=${encodeURIComponent(q)}` : "/search";

  return (
    <AppLayout query={q}>
      <Main
        posts={posts}
        pagination={paginationInfo}
        basePath={basePath}
      />
    </AppLayout>
  );
}