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
      const query = searchParams.get("q")?.toLowerCase() || "";
      const matching = records.filter(story => !query || story.title.toLowerCase().includes(query) || story.body.toLowerCase().includes(query));
      const page = Number(searchParams.get("p"));
      return route.fulfill({ json: { articles: matching.slice((page - 1) * 12, page * 12), total_count: matching.length } });
    }
    if (pathname === "/api/articles/25") return route.fulfill({ json: { article: stories[24] } });
    if (pathname === "/api/articles/25/comments") return route.fulfill({ json: { comments: [] } });
    throw new Error("Unexpected synthetic API request: " + pathname);
  });
});

test("a malformed article list retains browsing state and recovers through retry", async ({page}) => {
  let reads = 0;
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/api/articles?*", route => {
    reads++;
    return route.fulfill({json: {articles: reads === 1 ? [{...stories[0], title: {unexpected: true}}] : [stories[0]], total_count: 1}});
  });
  await page.goto("/?topic=coding&sort_by=title");
  await expect(page.getByRole("alert")).toContainText("Articles could not be loaded");
  expect(reads).toBe(1);
  await page.getByRole("button", {name: "Retry", exact: true}).click();
  await expect(page.locator("main li h3")).toHaveText(stories[0].title);
  expect(new URL(page.url()).searchParams.get("topic")).toBe("coding");
  expect(new URL(page.url()).searchParams.get("sort_by")).toBe("title");
  expect(reads).toBe(2);
  expect(errors).toEqual([]);
});

test("article text search is shareable, combines with filters, and resets the page", async ({ page }) => {
  await page.goto("/?topic=coding&sort_by=title&order=asc&p=2");
  const search = page.getByRole("search");
  const input = page.getByLabel("Search stories", { exact: true });
  await input.fill("STORY 25");
  await search.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/q=STORY\+25|q=STORY%2025/);
  await expect(page.locator("main li")).toHaveCount(1);
  await expect(page.locator("main li h3")).toHaveText("Synthetic story 25");
  await expect(page.getByRole("status")).toHaveText("Page 1 of 1 · 1 article");
  const params = new URL(page.url()).searchParams;
  expect(params.get("topic")).toBe("coding");
  expect(params.get("sort_by")).toBe("title");
  expect(params.get("order")).toBe("asc");
  expect(params.has("p")).toBe(false);
  await page.locator("main li a").click();
  await page.getByRole("link", { name: "← Back to these articles", exact: true }).click();
  await expect(input).toHaveValue("STORY 25");
  await expect(page.locator("main li h3")).toHaveText("Synthetic story 25");
  await input.fill("no matching story");
  await search.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("No articles match this search.", { exact: true })).toBeVisible();
  await expect(input).toHaveValue("no matching story");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("search controls fit at phone, tablet and desktop widths", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("Search stories", { exact: true });
  const button = page.getByRole("search").getByRole("button", { name: "Search", exact: true });
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => innerWidth)).toBe(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
    if (width <= 620) expect((await input.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
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

test("a temporary outage keeps only the matching previously loaded result page", async ({ page }) => {
  let offline = false;
  let requests = 0;
  await page.route("**/api/articles?*", route => {
    requests++;
    const { searchParams } = new URL(route.request().url());
    expect(route.request().method()).toBe("GET");
    if (offline) return route.fulfill({ status: 429, body: "Temporarily limiting connections" });
    expect(searchParams.get("topic")).toBe("coding");
    expect(searchParams.get("p")).toBe("3");
    expect(searchParams.get("sort_by")).toBe("title");
    expect(searchParams.get("order")).toBe("asc");
    return route.fulfill({ json: { articles: [stories[24]], total_count: 25 } });
  });
  const selected = "/?topic=coding&sort_by=title&order=asc&p=3";
  await page.goto(selected);
  await expect(page.getByRole("heading", { name: stories[24].title })).toBeVisible();
  offline = true;
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("Showing results loaded earlier in this tab.");
  await expect(page.getByRole("heading", { name: stories[24].title })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Page 3 of 3 · 25 articles");
  expect(requests).toBe(2);

  await page.goto("/?topic=football");
  await expect(page.getByRole("alert")).toContainText("limiting connections");
  await expect(page.locator("main li h3")).toHaveCount(0);
  await page.goto(selected);
  await expect(page.getByRole("alert")).toContainText("Showing results loaded earlier in this tab.");
  offline = false;
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: stories[24].title })).toBeVisible();
  expect(new URL(page.url()).search).toBe(selected.slice(1));
  expect(requests).toBe(5);
});

test("a previously opened article stays readable without voting or comments during an outage", async ({ page }) => {
  let status = 200;
  let articleRequests = 0;
  let commentRequests = 0;
  await page.route("**/api/articles/25", route => {
    articleRequests++;
    expect(route.request().method()).toBe("GET");
    return route.fulfill({ status, json: status === 200 ? { article: stories[24] } : { message: "Unavailable" } });
  });
  await page.route("**/api/articles/25/comments", route => {
    expect(route.request().method()).toBe("GET");
    commentRequests++;
    return route.fulfill({ json: { comments: [] } });
  });

  await page.goto("/articles/25");
  await expect(page.getByRole("button", { name: "Upvote article" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Comments" })).toBeVisible();
  status = 429;
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("Reading a copy loaded earlier in this tab.");
  await expect(page.getByText(stories[24].body, { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Upvote article" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Comments" })).toHaveCount(0);
  expect(commentRequests).toBe(1);
  expect(articleRequests).toBe(2);
  status = 200;
  await page.getByRole("button", { name: "Retry article", exact: true }).click();
  await expect(page.getByRole("button", { name: "Upvote article" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Comments" })).toBeVisible();
  expect(commentRequests).toBe(2);
  expect(articleRequests).toBe(3);

  status = 404;
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("This article does not exist");
  status = 429;
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("limiting connections");
  await expect(page.getByText(stories[24].body, { exact: true })).toHaveCount(0);
});
