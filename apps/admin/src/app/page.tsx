import { isLoggedIn } from "../utils/auth";
import LoginForm from "../components/LoginForm";
import AdminDashboard from "../components/AdminDashboard";
import { getAdminPosts } from "../utils/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main>
        <LoginForm />
      </main>
    );
  }

  const posts = await getAdminPosts();

  return (
    <main>
      <AdminDashboard posts={posts} />
    </main>
  );
}
