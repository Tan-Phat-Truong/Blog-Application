import { seed, seedForPagination } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.describe("PAGINATION", () => {
  test.beforeAll(async () => {
    // 3 base active posts + 5 extra = 8 active posts → 2 pages (POSTS_PER_PAGE = 6)
    await seedForPagination();
  });

  test.afterAll(async () => {
    await seed(); // restore base data so other suites are unaffected
  });

  test(
    "Page 1 shows 6 posts and pagination controls",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/");

      await expect(page.locator("article")).toHaveCount(6);
      await expect(page.getByTestId("pagination")).toBeVisible();
      await expect(page.getByTestId("pagination-info")).toContainText(
        "Page 1 of 2",
      );
      await expect(page.getByTestId("pagination-next")).toBeVisible();
      await expect(page.getByTestId("pagination-prev-disabled")).toBeVisible();
    },
  );

  test(
    "Clicking next navigates to page 2",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/");

      await page.getByTestId("pagination-next").click();

      await expect(page).toHaveURL("/?page=2");
      await expect(page.locator("article")).toHaveCount(2);
      await expect(page.getByTestId("pagination-info")).toContainText(
        "Page 2 of 2",
      );
      await expect(page.getByTestId("pagination-prev")).toBeVisible();
      await expect(page.getByTestId("pagination-next-disabled")).toBeVisible();
    },
  );

  test(
    "Clicking previous navigates back to page 1",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/?page=2");

      await page.getByTestId("pagination-prev").click();

      await expect(page).toHaveURL("/?page=1");
      await expect(page.getByTestId("pagination-info")).toContainText(
        "Page 1 of 2",
      );
    },
  );

  test(
    "Direct navigation to page 2 works",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/?page=2");

      await expect(page.locator("article")).toHaveCount(2);
      await expect(page.getByTestId("pagination-info")).toContainText(
        "Page 2 of 2",
      );
    },
  );

  test(
    "Out-of-range page clamps to last page",
    { tag: "@a4" },
    async ({ page }) => {
      await page.goto("/?page=999");

      await expect(page.locator("article")).toHaveCount(2);
      await expect(page.getByTestId("pagination-info")).toContainText(
        "Page 2 of 2",
      );
    },
  );

  test(
    "No pagination shown when posts fit one page",
    { tag: "@a4" },
    async ({ page }) => {
      await seed(); // 3 active posts → totalPages = 1 → Pagination returns null
      await page.goto("/category/react");

      await expect(page.getByTestId("pagination")).not.toBeVisible();
    },
  );
});
