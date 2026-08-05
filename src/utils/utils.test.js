import assert from "node:assert/strict";
import test from "node:test";
import axios from "axios";

let respond;
const originalAdapter = axios.defaults.adapter;
axios.defaults.adapter = async (config) => respond(config);
const { fetchAllArticles, addComment } = await import("./utils.js");
axios.defaults.adapter = originalAdapter;

test("article filters remain URL parameters and requests have a cold-start timeout", async () => {
  respond = (config) => {
    const url = new URL(config.url, config.baseURL);
    assert.equal(url.searchParams.get("topic"), "cooking&order=desc");
    assert.equal(url.searchParams.get("order"), "asc");
    assert.equal(config.timeout, 90000);
    return { data: { articles: [] }, status: 200, config };
  };
  assert.deepEqual(
    await fetchAllArticles("cooking&order=desc", "votes", "asc"),
    { articles: [] },
  );
});

test("a created comment is unwrapped from the API's array response", async () => {
  const comment = {
    comment_id: 301,
    body: "Sample comment",
    author: "weegembump",
  };
  respond = (config) => {
    assert.equal(config.method, "post");
    assert.equal(config.url, "/articles/1/comments");
    assert.deepEqual(JSON.parse(config.data), {
      username: "weegembump",
      body: "Sample comment",
    });
    return { data: { comment: [comment] }, status: 201, config };
  };
  assert.deepEqual(
    await addComment(1, "weegembump", "Sample comment"),
    comment,
  );
});

test("an empty comment response is rejected before it can enter the UI list", async () => {
  respond = (config) => ({ data: { comment: [] }, status: 201, config });
  await assert.rejects(
    addComment(1, "weegembump", "Sample comment"),
    /Invalid comment response/,
  );
});

test("upstream failures reach the caller's error and retry state", async () => {
  const failure = new Error("Service unavailable");
  respond = () => {
    throw failure;
  };
  await assert.rejects(fetchAllArticles(), (error) => error === failure);
});
