import { useEffect, useState } from "react";
import { fetchAllArticles } from "../utils/utils";
import ArticleCard from "./ArticleCard";

const ArticleList = () => {
  const [articleList, setArticleList] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllArticles().then(({ articles }) => {
      setArticleList(articles);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <h2>Your page is loading...</h2>
  
  return (
    <main className="article-list">
      <h2 className="article-list-title">Popular articles</h2>
      <ul className="article-card-list">
        {articleList.map(article => {
          return (
            <ArticleCard
            key={article.article_id}
            {...article}
            />  
          );
        })}
      </ul>
    </main>
  );
};
  
export default ArticleList;