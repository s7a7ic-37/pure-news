import { useEffect, useState } from "react";
import { fetchAllArticles } from "../utils/utils";
import ArticleCard from "./ArticleCard";
import { Link } from "react-router-dom";
import styles from "./ArticleList.module.css";

const ArticleList = () => {
  const [articleList, setArticleList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [topicSelected, setTopicSelected] = useState("");
  const [sortBySelected, setSortBySelected] = useState("");
  const [orderSelected, setOrderSelected] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;
    setIsLoading(true);
    setError("");

    fetchAllArticles(topicSelected, sortBySelected, orderSelected)
      .then(({ articles }) => {
        if (!Array.isArray(articles)) throw new Error("Invalid articles response");
        if (isCurrentRequest) setArticleList(articles);
      })
      .catch(() => {
        if (isCurrentRequest) {
          setArticleList([]);
          setError("Articles could not be loaded. The news service may be unavailable.");
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [topicSelected, sortBySelected, orderSelected, retryCount]);

  const toggleOrder = () => {
    setOrderSelected((order) => (order === "asc" ? "desc" : "asc"));
  };

  if (isLoading) return <main className={styles["article-list"]}><h2 role="status">Articles are loading…</h2><p>The free demo API can take about a minute to wake.</p></main>;

  return (
    <main className={styles["article-list"]}>
      <h2 className={styles["article-list-title"]}>Popular articles</h2>
      <div className={styles.filters}>
        <select
          id="topicSelect"
          className={styles.dropdown}
          name="topicSelected"
          value={topicSelected}
          onChange={(event) => setTopicSelected(event.target.value)}
          aria-label="Filter articles by topic"
        >
          <option value="">TOPIC</option>
          <option value="coding">TECHNOLOGY</option>
          <option value="cooking">COOKING</option>
          <option value="football">SPORTS</option>
        </select>
        <select
          id="sortSelect"
          className={styles.dropdown}
          name="sortBySelected"
          value={sortBySelected}
          onChange={(event) => setSortBySelected(event.target.value)}
          aria-label="Sort articles by"
        >
          <option value="">SORT BY</option>
          <option value="created_at">DATE</option>
          <option value="title">TITLE</option>
          <option value="author">AUTHOR</option>
          <option value="votes">VOTES</option>
          <option value="comment_count">COMMENTS</option>
        </select>
        <button className={styles["order-button"]} onClick={toggleOrder}>
          ORDER {orderSelected === "asc" ? "↑" : "↓"}
        </button>
      </div>
      {error ? (
        <p role="alert">
          {error} <button type="button" onClick={() => setRetryCount((count) => count + 1)}>Retry</button>
        </p>
      ) : articleList.length === 0 ? (
        <p>No articles match this selection.</p>
      ) : (
        <ul className={styles["article-card-list"]}>
          {articleList.map((article) => (
            <li key={article.article_id} className={styles["article-card"]}>
              <Link
                to={"/articles/" + article.article_id}
                className={styles["article-card-link"]}
              >
                <ArticleCard {...article} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ArticleList;
