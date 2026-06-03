"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: number;
  author: string;
  body: string;
  createdAt: string;
}

export function Comments({ urlId }: { urlId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${urlId}/comments`)
      .then((r) => r.json())
      .then((data: { comments: Comment[] }) => setComments(data.comments))
      .catch(() => {});
  }, [urlId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!author.trim() || !body.trim()) {
      setError("Name and comment are required.");
      return;
    }

    setSubmitting(true);
    const res = await fetch(`/api/posts/${urlId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: author.trim(), body: body.trim() }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Failed to submit comment.");
      return;
    }

    const data = (await res.json()) as { comment: Comment };
    setComments((prev) => [...prev, data.comment]);
    setAuthor("");
    setBody("");
  }

  return (
    <section
      className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8"
      data-test-id="comments-section"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h2>

      {/* Comment list */}
      <div
        className="space-y-4 mb-8"
        data-test-id="comments-list"
      >
        {comments.length === 0 ? (
          <p
            className="text-gray-500 dark:text-gray-400 text-sm"
            data-test-id="comments-empty"
          >
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              data-test-id="comment-item"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-semibold text-sm text-gray-900 dark:text-white"
                  data-test-id="comment-author"
                >
                  {c.author}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p
                className="text-sm text-gray-700 dark:text-gray-300"
                data-test-id="comment-body"
              >
                {c.body}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Submit form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3"
        data-test-id="comment-form"
      >
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Leave a comment
        </h3>

        {error && (
          <p
            className="text-red-600 text-sm"
            data-test-id="comment-error"
          >
            {error}
          </p>
        )}

        <div>
          <label
            htmlFor="comment-author"
            className="block text-sm text-gray-600 dark:text-gray-300 mb-1"
          >
            Name
          </label>
          <input
            id="comment-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            data-test-id="comment-author-input"
          />
        </div>

        <div>
          <label
            htmlFor="comment-body"
            className="block text-sm text-gray-600 dark:text-gray-300 mb-1"
          >
            Comment
          </label>
          <textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your comment..."
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            data-test-id="comment-body-input"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm px-4 py-2 rounded"
          data-test-id="comment-submit"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </section>
  );
}
