import { test, expect } from "@playwright/test";

test("votes lock while pending, use server totals and roll back failed changes", async ({ page }) => {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  const deltas = [];
  const totals = [50, 48, 49, null, 50, "invalid"];
  await page.route("**/api/**", async route => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path === "/api/articles/1/comments" && request.method() === "GET")
      return route.fulfill({ json: { comments: [] } });
    if (path === "/api/articles/1" && request.method() === "GET")
      return route.fulfill({ json: { article: { article_id: 1, title: "A synthetic voting story", topic: "coding",
        author: "weegembump", body: "Fictional browser-test content.", votes: 10, created_at: "2020-01-01T12:00:00Z", comment_count: 0,
        article_img_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='350'/%3E" } } });
    if (path === "/api/articles/1" && request.method() === "PATCH") {
      deltas.push(request.postDataJSON().inc_votes);
      const attempt = deltas.length - 1;
      if (attempt === 0) await pending;
      if (attempt === 3) return route.fulfill({ status: 503, json: { msg: "Synthetic unavailable service" } });
      return route.fulfill({ json: { article: { votes: totals[attempt] } } });
    }
    throw new Error("Unexpected synthetic API request: " + request.method() + " " + path);
  });
  await page.goto("/articles/1");
  const up = page.getByRole("button", { name: "Upvote article", exact: true });
  const down = page.getByRole("button", { name: "Downvote article", exact: true });
  const votes = page.locator("#article-card-container").getByText(/^Votes: /);
  try {
    await up.click();
    await expect(votes).toHaveText("Votes: 11");
    await expect(up).toBeDisabled();
    await expect(down).toBeDisabled();
    await expect(up).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Saving vote…", { exact: true })).toBeVisible();
    await expect.poll(() => deltas).toEqual([1]);
  } finally { release(); }
  await expect(votes).toHaveText("Votes: 50");
  await down.click();
  await expect(votes).toHaveText("Votes: 48");
  await expect(up).toHaveAttribute("aria-pressed", "false");
  await expect(down).toHaveAttribute("aria-pressed", "true");
  await down.click();
  await expect(votes).toHaveText("Votes: 49");
  await expect(down).toHaveAttribute("aria-pressed", "false");
  await up.click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(votes).toHaveText("Votes: 49");
  await expect(up).toBeEnabled();
  await expect(up).toHaveAttribute("aria-pressed", "false");
  await up.click();
  await expect(votes).toHaveText("Votes: 50");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await down.click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(votes).toHaveText("Votes: 50");
  await expect(up).toHaveAttribute("aria-pressed", "true");
  await expect(down).toHaveAttribute("aria-pressed", "false");
  expect(deltas).toEqual([1, -2, 1, 1, 1, -2]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
