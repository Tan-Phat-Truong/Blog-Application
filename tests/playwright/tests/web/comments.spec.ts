import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("COMMENTS", () => {
  test.beforeAll(async () => {
    await seed();
  });

  test.afterAll(async () => {
    await seed();
  });

  test(
    "Comment section is visible on post detail page",
    { tag: "@a5" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      await expect(page.getByTestId("comments-section")).toBeVisible();
      await expect(page.getByTestId("comment-form")).toBeVisible();
    },
  );

  test(
    "Shows empty state when no comments exist",
    { tag: "@a5" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      await expect(page.getByTestId("comments-empty")).toBeVisible();
    },
  );

  test(
    "Submitting a comment shows it in the list",
    { tag: "@a5" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      await page.getByTestId("comment-author-input").fill("Alice");
      await page.getByTestId("comment-body-input").fill("Great post!");
      await page.getByTestId("comment-submit").click();

      await expect(page.getByTestId("comment-item")).toHaveCount(1);
      await expect(page.getByTestId("comment-author").first()).toContainText("Alice");
      await expect(page.getByTestId("comment-body").first()).toContainText("Great post!");
    },
  );

  test(
    "Form clears after successful submission",
    { tag: "@a5" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      await page.getByTestId("comment-author-input").fill("Bob");
      await page.getByTestId("comment-body-input").fill("Very helpful!");
      await page.getByTestId("comment-submit").click();

      await expect(page.getByTestId("comment-author-input")).toHaveValue("");
      await expect(page.getByTestId("comment-body-input")).toHaveValue("");
    },
  );

  test(
    "Submitting empty fields shows an error",
    { tag: "@a5" },
    async ({ page }) => {
      await page.goto("/post/boost-your-conversion-rate");

      await page.getByTestId("comment-submit").click();

      await expect(page.getByTestId("comment-error")).toBeVisible();
    },
  );
});
