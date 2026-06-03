import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";
import Link from "next/link";
import logo from "@/asset/image/wsulo.png";
import Image from "next/image";
import { getSidebarPosts } from "@/functions/postQueries";

export async function LeftMenu() {
  const posts = await getSidebarPosts();

  return (
    <div className="flex flex-col py-4">
      <div className="mb-6 px-2">
        <Link href="/" className="flex items-center gap-3">
          <Image src={logo} alt="logo" width={36} height={36} />
          <span className="text-lg font-bold">Full Stack Blog</span>
        </Link>
      </div>
      <nav>
        <ul role="list" className="space-y-1">
          <CategoryList posts={posts} />
        </ul>
        <HistoryList selectedYear="" selectedMonth="" posts={posts} />
        <TagList selectedTag="" posts={posts} />
      </nav>
    </div>
  );
}
