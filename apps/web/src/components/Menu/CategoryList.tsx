import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import {
  BookmarkIcon,
  ServerIcon,
  CircleStackIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { SummaryItem } from "./SummaryItem";

const ALL_CATEGORIES: { name: string; icon: ReactNode }[] = [
  { name: "React", icon: <BookmarkIcon className="w-5 h-5" /> },
  { name: "Node", icon: <ServerIcon className="w-5 h-5" /> },
  { name: "Mongo", icon: <CircleStackIcon className="w-5 h-5" /> },
  { name: "DevOps", icon: <BriefcaseIcon className="w-5 h-5" /> },
];

export function CategoryList({ posts }: { posts: Post[] }) {
  const postCategories = categories(posts);

  const items = ALL_CATEGORIES.map(({ name, icon }) => {
    const found = postCategories.find((c) => c.name === name);
    return { name, count: found ? found.count : 0, icon };
  });

  return (
    <>
      {items.map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={false}
          link={`/category/${toUrlPath(item.name)}`}
          title={`Category / ${item.name}`}
          showCount={false}
          icon={item.icon}
        />
      ))}
    </>
  );
}
