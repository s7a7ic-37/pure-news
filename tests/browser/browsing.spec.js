import { test, expect } from "@playwright/test";

const image = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'/%3E";
const stories = Array.from({ length: 25 }, (_, index) => ({
  article_id: index + 1, title: `Synthetic story ${String(index + 1).padStart(2, "0")}`,
  topic: "coding", author: "weegembump", body: "Fictional browsing-test article.",
  created_at: "2020-01-01T12:00:00Z", votes: 0, comment_count: 0, article_img_url: image,
}));
const football = { ...stories[0], article_id: 26, title: "Synthetic football story", topic: "football", votes: 1, comment_count: 1 };

test.beforeEach(async ({ context }) => {
  await context.route("**/api/**", route => {
    expect(route.request().method()).toBe("GET");
    const { pathname, searchParams } = new URL(route.request().url());
    if (pathname === "/api/articles") {
      expect(searchParams.get("limit")).toBe("12");
      const records = searchParams.get("topic") === "football" ? [football] : stories;
      const page = Number(searchParams.get("p"));
      return route.fulfill({ json: { articles: records.slice((page - 1) * 12, page * 12), total_count: records.length } });
    }
    if (pathname === "/api/articles/25") return route.fulfill({ json: { article: stories[24] } });
    if (pathname === "/api/articles/25/comments") return route.fulfill({ json: { comments: [] } });
    throw new Error("Unexpected synthetic API request: " + pathname);
  });
});

test("reading preserves browsing filters and a lone final-page card keeps its column", async ({ page }) => {
  await page.goto("/?topic=coding&sort_by=title&order=asc&p=3");
  const cards = page.locator("main li");
  await expect(cards).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText("Page 3 of 3 · 25 articles");
  await expect(page.getByRole("button", { name: "Next", exact: true })).toBeDisabled();
  const layout = await cards.first().evaluate(node => ({
    width: node.getBoundingClientRect().width,
    grid: node.parentElement.getBoundingClientRect().width,
    columns: getComputedStyle(node.parentElement).gridTemplateColumns.split(" ").length,
  }));
  expect(layout.width).toBeLessThanOrEqual(layout.grid / layout.columns + 1);
  await cards.getByRole("link").click();
  await expect(page.getByRole("heading", { name: stories[24].title, exact: true })).toBeVisible();
  await page.getByRole("link", { name: "← Back to these articles", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Page 3 of 3 · 25 articles");
  await expect(page.getByLabel("Filter articles by topic", { exact: true })).toHaveValue("coding");
  await expect(page.getByLabel("Sort articles by", { exact: true })).toHaveValue("title");
  await expect(page.getByRole("button", { name: "Ascending order; switch to descending", exact: true })).toBeVisible();
  await page.getByLabel("Filter articles by topic", { exact: true }).selectOption("football");
  await expect(page.getByRole("heading", { name: football.title, exact: true })).toBeVisible();
  const filtered = new URL(page.url()).searchParams;
  expect(filtered.has("p")).toBe(false);
  expect(filtered.get("sort_by")).toBe("title");
  expect(filtered.get("order")).toBe("asc");
  await expect(page.getByRole("status")).toHaveText("Page 1 of 1 · 1 article");
  await expect(cards.getByText("1 vote", { exact: true })).toBeVisible();
  await expect(cards.getByText("1 comment ↗", { exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("status")).toHaveText("Page 3 of 3 · 25 articles");
  await expect(cards.getByRole("heading", { name: stories[24].title, exact: true })).toBeVisible();
});

test("an out-of-range shared page recovers to the first page and focuses its heading", async ({ page }) => {
  await page.goto("/?topic=coding&sort_by=title&order=asc&p=99");
  await expect(page.getByText("This page is beyond the available articles.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "First page", exact: true }).click();
  await expect(page.locator("main li")).toHaveCount(12);
  await expect(page.getByRole("status")).toHaveText("Page 1 of 3 · 25 articles");
  await expect(page.getByRole("heading", { name: "Latest stories", exact: true })).toBeFocused();
  expect(new URL(page.url()).searchParams.get("topic")).toBe("coding");
  expect(new URL(page.url()).searchParams.has("p")).toBe(false);
});
