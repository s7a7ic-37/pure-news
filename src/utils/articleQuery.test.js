import assert from "node:assert/strict";
import test from "node:test";
import { readArticleQuery, updateArticleQuery } from "./articleQuery.js";

test("a shared URL restores the article browsing state", () => {
  assert.deepEqual(readArticleQuery(new URLSearchParams("topic=coding&sort_by=votes&order=asc&p=3")), {
    topic: "coding", query: "", sortBy: "votes", order: "asc", page: 3,
  });
  assert.deepEqual(readArticleQuery(new URLSearchParams("q=database%20&topic=cooking")), {
    topic: "cooking", query: "database ", sortBy: "created_at", order: "desc", page: 1,
  });
  for (const p of ["0", "-1", "1.5", "100001", "1e2", "Infinity"]) {
    assert.deepEqual(readArticleQuery(new URLSearchParams(`topic=unknown&sort_by=invalid&order=invalid&p=${p}`)), {
      topic: "", query: "", sortBy: "created_at", order: "desc", page: 1,
    });
  }
});

test("filters reset pagination while page navigation preserves filters and original params", () => {
  const original = new URLSearchParams("topic=coding&sort_by=title&order=asc&p=3");
  assert.equal(updateArticleQuery(original, "topic", "cooking").toString(), "topic=cooking&sort_by=title&order=asc");
  assert.equal(updateArticleQuery(original, "p", "2").get("topic"), "coding");
  assert.equal(updateArticleQuery(original, "p", "1").has("p"), false);
  assert.equal(updateArticleQuery(original, "topic", "").has("topic"), false);
  const search = updateArticleQuery(original, "q", "dogs & cats");
  assert.equal(search.get("q"), "dogs & cats");
  assert.equal(search.has("p"), false);
  assert.equal(original.get("p"), "3");
});
