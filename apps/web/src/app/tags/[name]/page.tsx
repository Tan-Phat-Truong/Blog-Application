import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPostsByTag } from "@/functions/postQueries";
import { paginate } from "@/functions/paginate";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { name } = await params;
  const { page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page ?? "1") || 1);
  const allPosts = await getPostsByTag(name);
  const { items: posts, ...paginationInfo } = paginate(allPosts, pageNum);

  return (
    <AppLayout query={name}>
      <Main
        posts={posts}
        pagination={paginationInfo}
        basePath={`/tags/${name}`}
      />
    </AppLayout>
  );
}