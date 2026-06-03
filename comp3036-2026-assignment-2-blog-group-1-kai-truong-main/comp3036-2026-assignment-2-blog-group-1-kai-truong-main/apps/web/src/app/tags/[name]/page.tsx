import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPostsByTag } from "@/functions/postQueries";

export default async function Page({
  params,
}: {
   params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const filteredPosts = await getPostsByTag(name);

  return (
    <AppLayout query={name}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}