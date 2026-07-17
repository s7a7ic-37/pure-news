import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchArticleById } from "../utils/utils";
import SingleArticleCard from "./SingleArticleCard";
import CommentList from "./CommentList";
import styles from "./SingleArticle.module.css";

const SingleArticle = () => {
  const [presentArticle, setPresentArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { article_id } = useParams();

  useEffect(() => {
    let isCurrentRequest = true;
    setIsLoading(true);
    setError(false);
    setPresentArticle(null);

    fetchArticleById(article_id)
      .then(({ article }) => {
        if (isCurrentRequest) setPresentArticle(article);
      })
      .catch(() => {
        if (isCurrentRequest) setError(true);
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [article_id]);

  if (isLoading) return <h2 role="status">Article is loading…</h2>;

  if (error || !presentArticle) {
    return (
      <main className={styles["single-article-card"]}>
        <p role="alert">This article could not be loaded right now.</p>
        <Link to="/home">Back to articles</Link>
      </main>
    );
  }

  return (
    <main className={styles["single-article-card"]}>
      <SingleArticleCard key={article_id} presentArticle={presentArticle} />
      <CommentList key={article_id} article_id={article_id} />
    </main>
  );
};

export default SingleArticle;
