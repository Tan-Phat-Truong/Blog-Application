// import { posts, type Post } from "../components/data";

export function tags(posts: { tags: string; active: boolean }[]) {
  const map: Record<string, number> = {};

  for (const p of posts) {
    if (!p.active) continue;
    if (!p.tags) continue;

    const tagList = p.tags.split(",").map((t) => t.trim());

    for (const tag of tagList) {
      if (!tag) continue;

      map[tag] = (map[tag] || 0) + 1;
    }
  }

  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}