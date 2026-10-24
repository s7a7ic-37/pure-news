import assert from "node:assert/strict";
import test from "node:test";
import worker from "../../worker.js";

test("API proxy preserves query, method and vote body while page routes use assets", async (t) => {
  const requests = [];
  t.mock.method(globalThis, "fetch", async (request) => {
    requests.push(request);
    return Response.json({ article: { votes: 3 } });
  });
  const env = { ASSETS: { fetch: async () => new Response("page") } };
  await worker.fetch(new Request("https://news.example/api/articles?topic=coding&p=2"), env);
  assert.equal(requests[0].url, "https://pure-news-api-1.onrender.com/api/articles?topic=coding&p=2");
  await worker.fetch(new Request("https://news.example/api/articles/1", {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: '{"inc_votes":1}',
  }), env);
  assert.equal(requests[1].method, "PATCH");
  assert.deepEqual(await requests[1].json(), { inc_votes: 1 });
  assert.equal(await (await worker.fetch(new Request("https://news.example/articles/1"), env)).text(), "page");
  assert.equal(requests.length, 2);
});

test("unreachable API produces a retryable response without exposing the error", async (t) => {
  t.mock.method(globalThis, "fetch", async () => { throw new Error("internal details"); });
  const response = await worker.fetch(new Request("https://news.example/api"), {});
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { message: "News service temporarily unavailable." });
});
