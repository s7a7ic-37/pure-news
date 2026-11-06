import axios from "axios";

const apiUrl = axios.create({
  timeout: 90000,
  baseURL:
    import.meta.env?.VITE_API_URL || "https://news.artemislab.co.uk/api",
});

export const fetchAllArticles = (topic, sortBy, order, page = 1) => {
  const params = new URLSearchParams();
  if (topic) params.append("topic", topic);
  if (sortBy) params.append("sort_by", sortBy);
  if (order) params.append("order", order);
  params.set("limit", "12");
  params.set("p", String(page));

  return apiUrl.get("/articles?" + params).then(({ data }) => data);
};

export const fetchArticleById = (article_id) =>
  apiUrl.get("/articles/" + article_id).then(({ data }) => data);

export const fetchCommentsByArticle = (article_id) =>
  apiUrl.get("/articles/" + article_id + "/comments").then(({ data }) => data);

export const updateArticleVotes = (article_id, voteChange) =>
  apiUrl.patch("/articles/" + article_id, voteChange).then(({ data }) => {
    if (!Number.isInteger(data.article?.votes)) throw new Error("Invalid vote response");
    return data.article;
  });

export const addComment = (article_id, username, body) =>
  apiUrl
    .post("/articles/" + article_id + "/comments", { username, body })
    .then(({ data }) => {
      const comment = data.comment?.[0];
      if (!comment || !Number.isInteger(comment.comment_id))
        throw new Error("Invalid comment response");
      return comment;
    });
