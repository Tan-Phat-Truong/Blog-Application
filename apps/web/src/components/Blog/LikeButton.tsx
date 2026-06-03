"use client";

import { useState } from "react";

export function LikeButton({
  postId,
  initialLikes,
}: {
  postId: number;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);

  async function handleLike() {
    const response = await fetch("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });

    if (!response.ok) {
      return;
    }

    const result = (await response.json()) as { likes: number };
    setLikes(result.likes);
  }

  return (
    <button
      type="button"
      data-testid="like-button"
      data-test-id="like-button"
      onClick={handleLike}
      className="flex items-center gap-1 text-red-500"
    >
      <span aria-hidden="true">❤️</span>
      <span>{likes} likes</span>
    </button>
  );
}