import { isLoggedIn } from "../../../utils/auth";
import LoginForm from "../../../components/LoginForm";
import PostForm from "../../../components/PostForm";
import { notFound } from "next/navigation";
import { getAdminPostByUrlId } from "../../../utils/posts";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main>
        <LoginForm />
      </main>
    );
  }

  const post = await getAdminPostByUrlId(urlId);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <PostForm post={post} />
    </main>
  );
}
