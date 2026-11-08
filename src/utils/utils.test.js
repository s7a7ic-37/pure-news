import assert from "node:assert/strict";
import test from "node:test";
import axios from "axios";

let respond;
const originalAdapter = axios.defaults.adapter;
axios.defaults.adapter = async (config) => respond(config);
const { fetchAllArticles, fetchArticleById, fetchCommentsByArticle, addComment, updateArticleVotes } = await import("./utils.js");
axios.defaults.adapter = originalAdapter;

test("article filters and search remain URL parameters with a cold-start timeout", async () => {
  respond = (config) => {
    const url = new URL(config.url, config.baseURL);
    assert.equal(url.searchParams.get("topic"), "cooking&order=desc");
    assert.equal(url.searchParams.get("order"), "asc");
    assert.equal(url.searchParams.get("p"), "2");
    assert.equal(url.searchParams.get("limit"), "12");
    assert.equal(url.searchParams.get("q"), "database & APIs");
    assert.equal(config.timeout, 90000);
    return { data: { articles: [], total_count: 0 }, status: 200, config };
  };
  assert.deepEqual(
    await fetchAllArticles("cooking&order=desc", "votes", "asc", 2, "database & APIs"),
    { articles: [], total_count: 0 },
  );
});

test("a created comment is unwrapped from the API's array response", async () => {
  const comment = {
    comment_id: 301,
    body: "Sample comment",
    author: "weegembump",
    votes: 0,
    created_at: "2020-01-01T12:00:00Z",
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

test("article and comment payloads reject malformed rendered fields before reaching React", async () => {
  const article = {article_id: 1, title: "Fictional story", topic: "coding", author: "weegembump", body: "Fictional content.",
    created_at: "2020-01-01T12:00:00Z", article_img_url: "https://example.com/image.jpg", votes: 0, comment_count: 0};
  const comment = {comment_id: 1, body: "Fictional comment", author: "weegembump", created_at: article.created_at, votes: 0};
  for (const invalid of [null, {}, {...article, title: {}}, {...article, article_id: -1}, {...article, votes: "1"}, {...article, created_at: "bad"}]) {
    respond = config => ({data: {articles: [invalid], total_count: 1}, status: 200, config});
    await assert.rejects(fetchAllArticles(), /Invalid articles response/);
    respond = config => ({data: {article: invalid}, status: 200, config});
    await assert.rejects(fetchArticleById(1), /Invalid article response/);
  }
  respond = config => ({data: {article: {...article, body: {}}}, status: 200, config});
  await assert.rejects(fetchArticleById(1), /Invalid article response/);
  for (const invalid of [null, {...comment, body: {}}, {...comment, author: []}, {...comment, comment_id: 0}, {...comment, votes: "0"}]) {
    respond = config => ({data: {comments: [invalid]}, status: 200, config});
    await assert.rejects(fetchCommentsByArticle(1), /Invalid comments response/);
    respond = config => ({data: {comment: [invalid]}, status: 201, config});
    await assert.rejects(addComment(1, "weegembump", "Fictional comment"), /Invalid comment response/);
  }
  for (const data of [null, {articles: [], total_count: "0"}, {articles: [], total_count: -1}, {articles: [{...article, comment_count: {}}], total_count: 1}]) {
    respond = config => ({data, status: 200, config});
    await assert.rejects(fetchAllArticles(), /Invalid articles response/);
  }
  const summary = {...article}; delete summary.body;
  respond = config => ({data: {articles: [summary], total_count: 1}, status: 200, config});
  assert.deepEqual(await fetchAllArticles(), {articles: [summary], total_count: 1});
  const detail = {...article}; delete detail.comment_count;
  respond = config => ({data: {article: detail}, status: 200, config});
  assert.deepEqual(await fetchArticleById(1), {article: detail});
  respond = config => ({data: {comments: [comment]}, status: 200, config});
  assert.deepEqual(await fetchCommentsByArticle(1), {comments: [comment]});
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

test("votes return the server's total, including votes from other readers", async () => {
  respond = (config) => {
    assert.equal(config.method, "patch");
    assert.equal(config.url, "/articles/1");
    assert.deepEqual(JSON.parse(config.data), { inc_votes: 1 });
    return { data: { article: { article_id: 1, votes: 103 } }, status: 200, config };
  };
  assert.equal((await updateArticleVotes(1, { inc_votes: 1 })).votes, 103);
});

test("malformed vote totals reach the rollback handler", async () => {
  respond = (config) => ({ data: { article: { votes: "103" } }, status: 200, config });
  await assert.rejects(updateArticleVotes(1, { inc_votes: 1 }), /Invalid vote response/);
});
