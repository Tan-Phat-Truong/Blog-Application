import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import { getHomePosts } from "../functions/postQueries";
import styles from "./page.module.css";

export default async function Home() {
  const activePosts = await getHomePosts();

  return (
    <AppLayout>
      <Main posts={activePosts} className={styles.main} />
    </AppLayout>
  );
}
