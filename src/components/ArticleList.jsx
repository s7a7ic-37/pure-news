import { useEffect, useState } from "react";
import { fetchAllArticles } from "../utils/utils";
import ArticleCard from "./ArticleCard";
import { Link } from "react-router-dom";

const ArticleList = () => {
  const [articleList, setArticleList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchAllArticles().then(({ articles }) => {
      setArticleList(articles);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <h2>Your page is loading...</h2>;

  return (
    <main className="article-list">
      <h2 className="article-list-title">Popular articles</h2>
      <ul className="article-card-list">
        {articleList.map((article) => {
          return (
            <li key={article.article_id} className="article-card">
              <Link to={`/articles/${article.article_id}`}>
                <ArticleCard {...article} />
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default ArticleList;
