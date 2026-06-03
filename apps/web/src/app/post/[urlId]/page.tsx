import { AppLayout } from "@/components/Layout/AppLayout";
import { BlogDetail } from "@/components/Blog/Detail";
import { Comments } from "@/components/Blog/Comments";
import { getPostAndIncreaseViews } from "@/functions/postQueries";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const post = await getPostAndIncreaseViews(urlId);

  if (!post) {
    return <AppLayout>Article not found</AppLayout>;
  }

  return (
    <AppLayout>
      <BlogDetail post={post} views={post.views} />
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <Comments urlId={post.urlId} />
      </div>
    </AppLayout>
  );
}