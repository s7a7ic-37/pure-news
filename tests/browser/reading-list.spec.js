import { test, expect } from "@playwright/test";

const key = "pure-news-saved-stories-v1";
const article = {
  article_id: 1, title: "A synthetic reading-list story", topic: "coding",
  author: "weegembump", body: "Fictional browser-test content.",
  created_at: "2020-01-01T12:00:00Z", votes: 0, comment_count: 0,
  article_img_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='350'/%3E",
};

test.beforeEach(async ({ context }) => {
  await context.route("**/api/**", route => {
    expect(route.request().method()).toBe("GET");
    const path = new URL(route.request().url()).pathname;
    if (path === "/api/articles/1/comments") return route.fulfill({ json: { comments: [] } });
    if (path === "/api/articles/1") return route.fulfill({ json: { article } });
    throw new Error("Unexpected test API route: " + path);
  });
});

test("built styles and saved links survive reload and synchronize between tabs", async ({ page, context }) => {
  await page.goto("/articles/1");
  await expect(page.locator("body")).toHaveCSS("margin", "0px");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--paper").trim())).not.toBe("");
  await page.getByRole("button", { name: "Save story", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Remove from saved", exact: true })).toBeVisible();
  const other = await context.newPage();
  await other.goto("/saved");
  await expect(other.getByRole("link", { name: article.title, exact: true })).toBeVisible();
  expect(await other.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await other.getByRole("button", { name: `Remove ${article.title} from saved stories`, exact: true }).click();
  await expect(page.getByRole("button", { name: "Save story", exact: true })).toBeVisible();
  await expect(other.getByText("Your reading list is empty.", { exact: false })).toBeVisible();
});

test("failed storage writes preserve earlier links and offer recovery", async ({ page }) => {
  const previous = [{ article_id: 34, title: "An earlier saved link", saved_at: "2026-01-01T12:00:00Z" }];
  await page.addInitScript(({ key, previous }) => {
    localStorage.setItem(key, JSON.stringify(previous));
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException("Synthetic quota failure", "QuotaExceededError");
      return setItem.call(this, name, value);
    };
  }, { key, previous });
  await page.goto("/articles/1");
  await page.getByRole("button", { name: "Save story", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Your previous reading list is unchanged.");
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key)).toEqual(previous);
  await page.getByRole("button", { name: "Retry reading list", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page.getByRole("link", { name: "Saved (1)", exact: true }).click();
  await expect(page.getByRole("link", { name: previous[0].title, exact: true })).toBeVisible();
});

test("stale reading-list controls preserve the requested save or removal", async ({ page }) => {
  await page.goto("/articles/1");
  await expect(page.getByRole("button", { name: "Save story", exact: true })).toBeVisible();
  const saved = [{ article_id: article.article_id, title: article.title, saved_at: "2026-01-01T12:00:00Z" }];
  // Hold the UI behind storage to model a tab awaiting its storage notification.
  await page.evaluate(({ key, saved }) => localStorage.setItem(key, JSON.stringify(saved)), { key, saved });
  await page.getByRole("button", { name: "Save story", exact: true }).click();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key)).toEqual(saved);
  await expect(page.getByRole("button", { name: "Remove from saved", exact: true })).toBeVisible();

  await page.evaluate(key => localStorage.setItem(key, "[]"), key);
  await page.getByRole("button", { name: "Remove from saved", exact: true }).click();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key)).toEqual([]);
  await expect(page.getByRole("button", { name: "Save story", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Save story", exact: true }).click();
  await page.getByRole("link", { name: "Saved (1)", exact: true }).click();
  await expect(page.getByRole("button", { name: `Remove ${article.title} from saved stories`, exact: true })).toBeVisible();
  await page.evaluate(key => localStorage.setItem(key, "[]"), key);
  await page.getByRole("button", { name: `Remove ${article.title} from saved stories`, exact: true }).click();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key)).toEqual([]);
  await expect(page.getByText("Your reading list is empty.", { exact: false })).toBeVisible();
});
