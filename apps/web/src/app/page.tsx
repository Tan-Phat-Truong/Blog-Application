import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import { getHomePosts } from "../functions/postQueries";
import { paginate } from "../functions/paginate";
import styles from "./page.module.css";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page ?? "1") || 1);
  const allPosts = await getHomePosts();
  const { items: posts, ...paginationInfo } = paginate(allPosts, pageNum);

  return (
    <AppLayout>
      <Main
        posts={posts}
        className={styles.main}
        heading="From the blog"
        subheading="Learn how to grow your business with our expert advice."
        pagination={paginationInfo}
        basePath="/"
      />
    </AppLayout>
  );
}
