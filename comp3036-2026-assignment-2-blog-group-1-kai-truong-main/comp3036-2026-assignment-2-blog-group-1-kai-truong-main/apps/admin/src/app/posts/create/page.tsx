import { isLoggedIn } from "../../../utils/auth";
import LoginForm from "../../../components/LoginForm";
import PostForm from "../../../components/PostForm";

export const dynamic = "force-dynamic";

export default async function CreatePostPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main>
        <LoginForm />
      </main>
    );
  }

  return (
    <main>
      <PostForm />
    </main>
  );
}
