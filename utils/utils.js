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
