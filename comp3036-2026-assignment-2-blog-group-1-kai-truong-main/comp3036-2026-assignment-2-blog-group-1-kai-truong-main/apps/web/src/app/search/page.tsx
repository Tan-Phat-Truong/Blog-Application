import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { searchPosts } from "@/functions/postQueries";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const filteredPosts = await searchPosts(q ?? "");

  return (
    <AppLayout query={q}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}