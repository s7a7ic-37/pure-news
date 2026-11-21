import axios from "axios";
import { readArticleSnapshot, updateArticleSnapshot } from "./articleSnapshots.js";

const apiUrl = axios.create({
  timeout: 90000,
  baseURL:
    import.meta.env?.VITE_API_URL || "https://news.artemislab.co.uk/api",
});

const isArticle = (article) => article && Number.isSafeInteger(article.article_id) && article.article_id > 0 &&
  ["title", "author", "topic", "created_at", "article_img_url"].every(key => typeof article[key] === "string") &&
  Number.isSafeInteger(article.votes) && Number.isFinite(Date.parse(article.created_at));

const isComment = (comment) => comment && Number.isSafeInteger(comment.comment_id) && comment.comment_id > 0 &&
  ["body", "author", "created_at"].every(key => typeof comment[key] === "string") &&
  Number.isSafeInteger(comment.votes) && Number.isFinite(Date.parse(comment.created_at));

export const isTransientArticleFailure = (failure) =>
  [408, 429, 502, 503, 504].includes(failure.response?.status) ||
  ["ERR_NETWORK", "ECONNABORTED", "ETIMEDOUT"].includes(failure.code);

async function readArticles(path, isValid, invalidMessage) {
  const snapshotKey = apiUrl.getUri({ url: path });
  let data;
  try {
    ({ data } = await apiUrl.get(path));
  } catch (failure) {
    const status = failure.response?.status;
    if ([400, 404, 410].includes(status)) updateArticleSnapshot(snapshotKey);
    if (isTransientArticleFailure(failure)) {
      const saved = readArticleSnapshot(snapshotKey);
      if (saved && isValid(saved.data)) return { ...saved.data, cachedAt: saved.at };
    }
    throw failure;
  }
  if (!isValid(data)) throw new Error(invalidMessage);
  updateArticleSnapshot(snapshotKey, data);
  return data;
}

export const fetchAllArticles = (topic, sortBy, order, page = 1, query = "") => {
  const params = new URLSearchParams();
  if (topic) params.append("topic", topic);
  if (sortBy) params.append("sort_by", sortBy);
  if (order) params.append("order", order);
  if (query) params.set("q", query);
  params.set("limit", "12");
  params.set("p", String(page));

  return readArticles("/articles?" + params, data =>
    Array.isArray(data?.articles) &&
    data.articles.every(article => isArticle(article) && Number.isSafeInteger(article.comment_count) && article.comment_count >= 0) &&
    Number.isSafeInteger(data.total_count) && data.total_count >= 0,
  "Invalid articles response");
};

export const fetchArticleById = (article_id) =>
  readArticles("/articles/" + article_id, data => isArticle(data?.article) &&
    data.article.article_id === Number(article_id) && typeof data.article.body === "string",
  "Invalid article response");

export const fetchCommentsByArticle = (article_id) =>
  apiUrl.get("/articles/" + article_id + "/comments").then(({ data }) => {
    if (!Array.isArray(data?.comments) || !data.comments.every(isComment)) throw new Error("Invalid comments response");
    return data;
  });

export const updateArticleVotes = (article_id, voteChange) =>
  apiUrl.patch("/articles/" + article_id, voteChange).then(({ data }) => {
    if (!Number.isSafeInteger(data?.article?.votes)) throw new Error("Invalid vote response");
    return data.article;
  });

export const addComment = (article_id, username, body) =>
  apiUrl
    .post("/articles/" + article_id + "/comments", { username, body })
    .then(({ data }) => {
      const comment = data?.comment?.[0];
      if (!isComment(comment))
        throw new Error("Invalid comment response");
      return comment;
    });
