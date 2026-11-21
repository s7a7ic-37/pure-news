import assert from "node:assert/strict";
import test from "node:test";
import { readArticleSnapshot, updateArticleSnapshot } from "./articleSnapshots.js";

function useSession(t) {
  let stored = null;
  let now = Date.UTC(2026, 10, 21, 14);
  globalThis.window = { sessionStorage: {
    getItem: () => stored,
    setItem: (_key, value) => { stored = value; },
  } };
  t.mock.method(Date, "now", () => now);
  t.after(() => { delete globalThis.window; });
  return {
    advance: (ms) => { now += ms; },
    corrupt: () => { stored = "broken"; },
  };
}

test("snapshots expire, use exact keys, and can be removed after a missing article", t => {
  const session = useSession(t);
  const article = { article: { title: "Fictional story" } };
  updateArticleSnapshot("/articles/1", article);
  assert.deepEqual(readArticleSnapshot("/articles/1").data, article);
  assert.equal(readArticleSnapshot("/articles/2"), undefined);
  session.advance(6 * 60 * 60 * 1000 + 1);
  assert.equal(readArticleSnapshot("/articles/1"), undefined);
  updateArticleSnapshot("/articles/1", article);
  updateArticleSnapshot("/articles/1");
  assert.equal(readArticleSnapshot("/articles/1"), undefined);
});

test("storage keeps eight small reads and does not interrupt on corrupt or blocked storage", t => {
  const session = useSession(t);
  for (let i = 0; i < 9; i++) updateArticleSnapshot(String(i), { i });
  assert.equal(readArticleSnapshot("0"), undefined);
  assert.equal(readArticleSnapshot("8").data.i, 8);
  updateArticleSnapshot("oversized", { body: "x".repeat(64 * 1024) });
  assert.equal(readArticleSnapshot("oversized"), undefined);
  session.corrupt();
  assert.equal(readArticleSnapshot("8"), undefined);
  updateArticleSnapshot("8", { i: 8 });
  assert.equal(readArticleSnapshot("8").data.i, 8);
  Object.defineProperty(window, "sessionStorage", { get() { throw new Error("Browser blocked storage"); } });
  assert.equal(readArticleSnapshot("8"), undefined);
  assert.doesNotThrow(() => updateArticleSnapshot("9", { i: 9 }));
});
