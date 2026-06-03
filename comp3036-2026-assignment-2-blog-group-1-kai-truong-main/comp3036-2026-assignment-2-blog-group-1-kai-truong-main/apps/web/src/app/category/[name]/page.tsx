import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPostsByCategory } from "@/functions/postQueries";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const filteredPosts = await getPostsByCategory(name);

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
