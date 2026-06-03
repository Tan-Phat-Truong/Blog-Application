"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "@repo/db/data";

export default function AdminDashboard({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [postItems, setPostItems] = useState(posts);
  const [contentFilter, setContentFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    setPostItems(posts);
  }, [posts]);

  const filteredAndSorted = useMemo(() => {
    let result = [...postItems];

    // Filter by content (title or content)
    if (contentFilter) {
      const lower = contentFilter.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.content.toLowerCase().includes(lower)
      );
    }

    // Filter by tag
    if (tagFilter) {
      const lower = tagFilter.toLowerCase();
      result = result.filter((p) =>
        p.tags.toLowerCase().includes(lower)
      );
    }

    // Filter by date (on or after)
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      result = result.filter((p) => new Date(p.date) >= filterDate);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [postItems, contentFilter, tagFilter, dateFilter, sortBy]);

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.refresh();
  }

  async function handleToggleActive(postUrlId: string) {
    const response = await fetch(`/api/posts/${postUrlId}/toggle`, {
      method: "PATCH",
    });

    if (!response.ok) {
      return;
    }

    setPostItems((currentPosts) =>
      currentPosts.map((post) =>
        post.urlId === postUrlId ? { ...post, active: !post.active } : post,
      ),
    );
  }

  function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin of Full Stack Blog</h1>
        <div className="flex gap-4">
          <a
            href="/posts/create"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Post
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label htmlFor="content-filter" className="block text-sm font-medium mb-1">
            Filter by Content:
          </label>
          <input
            id="content-filter"
            type="text"
            value={contentFilter}
            onChange={(e) => setContentFilter(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="tag-filter" className="block text-sm font-medium mb-1">
            Filter by Tag:
          </label>
          <input
            id="tag-filter"
            type="text"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium mb-1">
            Filter by Date Created:
          </label>
          <input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="sort-by" className="block text-sm font-medium mb-1">
            Sort By:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Post List */}
      <div className="space-y-4">
        {filteredAndSorted.map((post) => (
          <article
            key={post.id}
            className="border rounded-lg p-4 flex gap-4"
          >
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={128}
              height={96}
              unoptimized
              className="w-32 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <a
                href={`/post/${post.urlId}`}
                className="text-lg font-semibold hover:underline"
              >
                {post.title}
              </a>
              <div className="text-sm text-gray-600 mt-1">
                Posted on {formatDate(post.date)}
              </div>
              <div className="text-sm mt-1">{post.category}</div>
              <div className="text-sm text-gray-500 mt-1">
                {post.tags
                  .split(",")
                  .map((t) => `#${t.trim()}`)
                  .join(", ")}
              </div>
            </div>
            <div className="flex items-start">
              <button
                type="button"
                onClick={() => handleToggleActive(post.urlId)}
                className={`px-3 py-1 rounded text-sm ${
                  post.active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {post.active ? "Active" : "Inactive"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
