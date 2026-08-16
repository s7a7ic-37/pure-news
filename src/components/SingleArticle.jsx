import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchArticleById } from "../utils/utils";
import SingleArticleCard from "./SingleArticleCard";
import CommentList from "./CommentList";
import styles from "./SingleArticle.module.css";

const SingleArticle = () => {
  const [presentArticle, setPresentArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { article_id } = useParams();
  const { state } = useLocation();
  const backToArticles = { pathname: "/", search: state?.browseSearch || "" };

  useEffect(() => {
    let isCurrentRequest = true;
    setIsLoading(true);
    setError("");
    setPresentArticle(null);

    fetchArticleById(article_id)
      .then(({ article }) => {
        if (isCurrentRequest) setPresentArticle(article);
      })
      .catch((failure) => {
        if (isCurrentRequest)
          setError(
            [400, 404].includes(failure.response?.status)
              ? "missing"
              : "unavailable",
          );
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [article_id, retryCount]);

  if (isLoading)
    return (
      <main className={styles["single-article-card"]}>
        <h2 role="status">Article is loading…</h2>
        <p>The free demo API can take about a minute to wake.</p>
      </main>
    );

  if (error || !presentArticle) {
    return (
      <main className={styles["single-article-card"]}>
        <p role="alert">
          {error === "missing"
            ? "This article does not exist. Check the link or browse the article list."
            : "This article could not be loaded right now."}
        </p>
        {error !== "missing" && (
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Retry article
          </button>
        )}
        <Link to={backToArticles}>Back to articles</Link>
      </main>
    );
  }

  return (
    <main className={styles["single-article-card"]}>
      <Link to={backToArticles}>← Back to these articles</Link>
      <SingleArticleCard key={article_id} presentArticle={presentArticle} />
      <CommentList key={article_id} article_id={article_id} />
    </main>
  );
};

export default SingleArticle;
