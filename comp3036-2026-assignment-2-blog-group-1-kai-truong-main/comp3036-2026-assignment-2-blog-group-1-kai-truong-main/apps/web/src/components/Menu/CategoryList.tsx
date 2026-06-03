import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";

const ALL_CATEGORIES = ["DevOps", "Mongo", "Node", "React"];

export function CategoryList({ posts }: { posts: Post[] }) {
  const postCategories = categories(posts);

  const items = ALL_CATEGORIES.map((name) => {
    const found = postCategories.find((c) => c.name === name);
    return { name, count: found ? found.count : 0 };
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
        />
      ))}
    </>
  );
}
