import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchArticleById } from "../utils/utils";
import SingleArticleCard from "./SingleArticleCard";
import CommentList from "./CommentList";
import styles from "./SingleArticle.module.css";

const SingleArticle = ({ savedStories, onToggleSave }) => {
  const [presentArticle, setPresentArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { article_id } = useParams();
  const { state } = useLocation();
  const backToArticles = state?.fromSaved ? "/saved" : { pathname: "/", search: state?.browseSearch || "" };

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
        <Link to={backToArticles}>{state?.fromSaved ? "Back to saved stories" : "Back to articles"}</Link>
      </main>
    );
  }

  return (
    <main className={styles["single-article-card"]}>
      <div className={styles.actions}>
        <Link to={backToArticles}>{state?.fromSaved ? "← Back to saved stories" : "← Back to these articles"}</Link>
        <button type="button" onClick={() => onToggleSave(presentArticle)} aria-pressed={savedStories.some((story) => story.article_id === presentArticle.article_id)}>
          {savedStories.some((story) => story.article_id === presentArticle.article_id) ? "Remove from saved" : "Save story"}
        </button>
      </div>
      <SingleArticleCard key={article_id} presentArticle={presentArticle} />
      <CommentList key={article_id} article_id={article_id} />
    </main>
  );
};

export default SingleArticle;
