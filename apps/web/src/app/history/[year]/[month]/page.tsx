import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPostsByHistory } from "@/functions/postQueries";
import { paginate } from "@/functions/paginate";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ year: string; month: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { year, month } = await params;
  const { page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page ?? "1") || 1);
  const allPosts = await getPostsByHistory(year, month);
  const { items: posts, ...paginationInfo } = paginate(allPosts, pageNum);

  return (
    <AppLayout>
      <Main
        posts={posts}
        pagination={paginationInfo}
        basePath={`/history/${year}/${month}`}
      />
    </AppLayout>
  );
}