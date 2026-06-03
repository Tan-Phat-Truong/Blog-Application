"use client";

import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import type { Post } from "@repo/db/data";

type PostFormProps = {
  post?: Post;
};

type Errors = {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  tags?: string;
};

export default function PostForm({ post }: PostFormProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [content, setContent] = useState(post?.content || "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || "");
  const [tags, setTags] = useState(post?.tags || "");
  const [category, setCategory] = useState(post?.category || "");
  const [errors, setErrors] = useState<Errors>({});
  const [showPreview, setShowPreview] = useState(false);
  const [hasGlobalError, setHasGlobalError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [restoreCursor, setRestoreCursor] = useState(false);
  const cursorPosRef = useRef(0);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  function validate(): Errors {
    const errs: Errors = {};

    if (!title.trim()) {
      errs.title = "Title is required";
    }

    if (!description.trim()) {
      errs.description = "Description is required";
    } else if (description.length > 200) {
      errs.description =
        "Description is too long. Maximum is 200 characters";
    }

    if (!content.trim()) {
      errs.content = "Content is required";
    }

    if (!imageUrl.trim()) {
      errs.imageUrl = "Image URL is required";
    } else {
      try {
        new URL(imageUrl);
      } catch {
        errs.imageUrl = "This is not a valid URL";
      }
    }

    if (!tags.trim()) {
      errs.tags = "At least one tag is required";
    }

    return errs;
  }

  async function handleSave() {
    setSuccessMessage("");
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      setHasGlobalError(true);
      return;
    }

    setHasGlobalError(false);

    const response = await fetch(post ? `/api/posts/${post.urlId}` : "/api/posts", {
      method: post ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        content,
        imageUrl,
        tags,
        category,
      }),
    });

    if (!response.ok) {
      setHasGlobalError(true);
      return;
    }

    setSuccessMessage("Post updated successfully");
  }

  function handlePreviewToggle() {
    if (!showPreview) {
      // Save cursor position before showing preview
      if (contentRef.current) {
        cursorPosRef.current = contentRef.current.selectionStart;
      }
      setShowPreview(true);
    } else {
      setShowPreview(false);
      setRestoreCursor(true);
    }
  }

  useEffect(() => {
    if (restoreCursor && !showPreview && contentRef.current) {
      contentRef.current.focus();
      contentRef.current.setSelectionRange(
        cursorPosRef.current,
        cursorPosRef.current
      );
      setRestoreCursor(false);
    }
  }, [restoreCursor, showPreview]);

  const renderedContent = showPreview ? marked.parse(content) : "";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {post ? "Edit Post" : "Create Post"}
      </h1>

      {successMessage && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {hasGlobalError && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          Please fix the errors before saving
        </div>
      )}

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Category (only for create) */}
        {!post && (
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content
          </label>
          {showPreview ? (
            <div
              data-test-id="content-preview"
              className="border rounded px-3 py-2 min-h-[150px] prose"
              dangerouslySetInnerHTML={{
                __html: renderedContent as string,
              }}
            />
          ) : (
            <textarea
              id="content"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={8}
            />
          )}
          {errors.content && (
            <p className="text-red-600 text-sm mt-1">{errors.content}</p>
          )}
          <button
            type="button"
            onClick={handlePreviewToggle}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            {showPreview ? "Close Preview" : "Preview"}
          </button>
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
            Image URL
          </label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.imageUrl && (
            <p className="text-red-600 text-sm mt-1">{errors.imageUrl}</p>
          )}
          {imageUrl && !errors.imageUrl && (
            <img
              data-test-id="image-preview"
              src={imageUrl}
              alt="Preview"
              className="mt-2 max-w-xs rounded"
            />
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.tags && (
            <p className="text-red-600 text-sm mt-1">{errors.tags}</p>
          )}
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
