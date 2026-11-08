import { test, expect } from "@playwright/test";

const draft = "Fictional comment for a delayed browser-test request.";

async function openArticle(page, post) {
  await page.route("**/api/**", route => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path === "/api/articles/1/comments") {
      if (request.method() === "POST") return post(route);
      if (request.method() === "GET") return route.fulfill({ json: { comments: [] } });
    }
    if (path === "/api/articles/1" && request.method() === "GET")
      return route.fulfill({ json: { article: { article_id: 1, title: "A synthetic comment story", topic: "coding",
        author: "weegembump", body: "Fictional browser-test content.", votes: 0, created_at: "2020-01-01T12:00:00Z", comment_count: 0,
        article_img_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='350'/%3E" } } });
    throw new Error("Unexpected synthetic API request: " + request.method() + " " + path);
  });
  await page.goto("/articles/1");
}

test("a pending comment protects its text and adds the confirmed response once", async ({ page }) => {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  let posts = 0;
  await openArticle(page, async route => {
    posts += 1;
    expect(route.request().postDataJSON()).toEqual({ username: "weegembump", body: draft });
    await pending;
    return route.fulfill({ status: 201, json: { comment: [{ comment_id: 100, article_id: 1, body: draft,
      author: "weegembump", votes: 0, created_at: "2020-01-01T12:00:00Z" }] } });
  });
  const input = page.getByLabel("Comment as weegembump", { exact: true });
  await input.fill(draft);
  try {
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue(draft);
    await expect(page.getByRole("button", { name: "Submitting...", exact: true })).toBeDisabled();
  } finally { release(); }
  await expect(page.getByText("Your comment has been posted", { exact: true })).toBeVisible();
  await expect(input).toBeEnabled();
  await expect(input).toHaveValue("");
  await expect(page.getByText(draft, { exact: true })).toHaveCount(1);
  expect(posts).toBe(1);
});

for (const failure of ["unavailable", "malformed"]) {
test(`a ${failure} comment response keeps the draft and permits an explicit later submission`, async ({ page }) => {
  let posts = 0;
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await openArticle(page, route => {
    posts += 1;
    return failure === "unavailable"
      ? route.fulfill({ status: 503, json: { msg: "Synthetic unavailable service" } })
      : route.fulfill({ status: 201, json: {comment: [{comment_id: 101, body: {unexpected: true}, author: "weegembump", votes: 0, created_at: "2020-01-01T12:00:00Z"}]} });
  });
  const input = page.getByLabel("Comment as weegembump", { exact: true });
  await input.fill(draft);
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Check the discussion before submitting again.");
  await expect(input).toBeEnabled();
  await expect(input).toHaveValue(draft);
  expect(posts).toBe(1);
  await input.fill(draft + " Edited after the failure.");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect.poll(() => posts).toBe(2);
  await expect(input).toBeEnabled();
  await expect(input).toHaveValue(draft + " Edited after the failure.");
  expect(errors).toEqual([]);
});
}
