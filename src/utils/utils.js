import axios from "axios";

const apiUrl = axios.create({
  baseURL: `https://nc-news-api-z9fc.onrender.com/api`,
});

export const fetchAllArticles = () => {
  return apiUrl
    .get("/articles")
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchArticleById = (article_id) => {
  return apiUrl
    .get(`/articles/${article_id}`)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchCommentsByArticle = (article_id) => {
  return apiUrl
    .get(`/articles/${article_id}/comments`)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateArticleVotes = (article_id, voteChange) => {
  return apiUrl
    .patch(`/articles/${article_id}`, voteChange)
    .then(({ data }) => {
      return data;
    });
};

export const addComment = (article_id, username, body) => {
  return apiUrl
    .post(`/articles/${article_id}/comments`, {
      username: username,
      body: body,
    })
    .then(({ data }) => {
      return data.comment[0];
    });
};