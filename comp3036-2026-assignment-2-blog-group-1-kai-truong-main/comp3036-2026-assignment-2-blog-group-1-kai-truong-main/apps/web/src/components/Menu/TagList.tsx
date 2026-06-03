import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";
import { toUrlPath } from "@repo/utils/url";
export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const postTags = await tags(posts);

  return (
    <LinkList title="Tags">
      {postTags.map((item) => {
        const link = `/tags/${toUrlPath(item.name)}`;

        const isSelected =
          selectedTag === toUrlPath(item.name);

        return (
          <SummaryItem
            key={item.name}
            name={item.name}
            link={`/tags/${toUrlPath(item.name)}`}
            count={item.count}
            isSelected={isSelected}
            title={`Tag / ${item.name}`}
          />
        );
      })}
    </LinkList>
  );
}
