import axios from "axios";

const apiUrl = axios.create({
  baseURL:
    import.meta.env?.VITE_API_URL ||
    "https://pure-news-api-1.onrender.com/api",
});

export const fetchAllArticles = (topic, sortBy, order) => {
  const params = new URLSearchParams();
  if (topic) params.append("topic", topic);
  if (sortBy) params.append("sort_by", sortBy);
  if (order) params.append("order", order);

  return apiUrl.get("/articles?" + params).then(({ data }) => data);
};

export const fetchArticleById = (article_id) =>
  apiUrl.get("/articles/" + article_id).then(({ data }) => data);

export const fetchCommentsByArticle = (article_id) =>
  apiUrl.get("/articles/" + article_id + "/comments").then(({ data }) => data);

export const updateArticleVotes = (article_id, voteChange) =>
  apiUrl.patch("/articles/" + article_id, voteChange).then(({ data }) => data);

export const addComment = (article_id, username, body) =>
  apiUrl
    .post("/articles/" + article_id + "/comments", { username, body })
    .then(({ data }) => data.comment[0]);
