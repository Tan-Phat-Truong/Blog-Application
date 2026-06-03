import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPostsByHistory } from "@/functions/postQueries";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const filteredPosts = await getPostsByHistory(year, month);

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}