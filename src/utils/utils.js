import axios from "axios";

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

export const fetchAllArticles = (topic, sortBy, order, page = 1, query = "") => {
  const params = new URLSearchParams();
  if (topic) params.append("topic", topic);
  if (sortBy) params.append("sort_by", sortBy);
  if (order) params.append("order", order);
  if (query) params.set("q", query);
  params.set("limit", "12");
  params.set("p", String(page));

  return apiUrl.get("/articles?" + params).then(({ data }) => {
    if (!Array.isArray(data?.articles) ||
        !data.articles.every(article => isArticle(article) && Number.isSafeInteger(article.comment_count) && article.comment_count >= 0) ||
        !Number.isSafeInteger(data.total_count) || data.total_count < 0)
      throw new Error("Invalid articles response");
    return data;
  });
};

export const fetchArticleById = (article_id) =>
  apiUrl.get("/articles/" + article_id).then(({ data }) => {
    if (!isArticle(data?.article) || typeof data.article.body !== "string") throw new Error("Invalid article response");
    return data;
  });

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
