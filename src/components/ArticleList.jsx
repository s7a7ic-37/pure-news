import { useEffect, useRef, useState } from "react";
import { fetchAllArticles } from "../utils/utils";
import ArticleCard from "./ArticleCard";
import { Link, useSearchParams } from "react-router-dom";
import { readArticleQuery, updateArticleQuery } from "../utils/articleQuery";
import styles from "./ArticleList.module.css";

const ArticleList = () => {
  const [articleList, setArticleList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { topic: topicSelected, query: querySelected, sortBy: sortBySelected, order: orderSelected, page } = readArticleQuery(searchParams);
  const [queryInput, setQueryInput] = useState(querySelected);
  const [totalCount, setTotalCount] = useState(0);
  const headingRef = useRef(null);
  const pageChangeRequested = useRef(false);
  const updateQuery = (key, value) => setSearchParams(updateArticleQuery(searchParams, key, value));
  const searchArticles = (event) => { event.preventDefault(); updateQuery("q", queryInput.trim()); };
  const goToPage = (value) => { pageChangeRequested.current = true; updateQuery("p", String(value)); };

  useEffect(() => setQueryInput(querySelected), [querySelected]);

  useEffect(() => {
    let isCurrentRequest = true;
    setIsLoading(true);
    setError("");

    fetchAllArticles(topicSelected, sortBySelected, orderSelected, page, querySelected)
      .then(({ articles, total_count }) => {
        if (!Array.isArray(articles) || !Number.isInteger(total_count) || total_count < 0)
          throw new Error("Invalid articles response");
        if (isCurrentRequest) {
          setArticleList(articles); setTotalCount(total_count);
          if (pageChangeRequested.current) {
            headingRef.current?.focus();
            pageChangeRequested.current = false;
          }
        }
      })
      .catch(() => {
        if (isCurrentRequest) {
          pageChangeRequested.current = false;
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
  }, [topicSelected, querySelected, sortBySelected, orderSelected, page, retryCount]);

  const toggleOrder = () => {
    updateQuery("order", orderSelected === "asc" ? "desc" : "asc");
  };

  return (
    <main className={styles["article-list"]} aria-busy={isLoading}>
      <div className={styles.intro}>
        <h2 ref={headingRef} tabIndex="-1" className={styles["article-list-title"]}>Latest stories</h2>
      </div>
      <div className={styles.filters}>
        <form className={styles.search} role="search" onSubmit={searchArticles}>
          <label htmlFor="article-search">Search stories
            <input id="article-search" type="search" value={queryInput} maxLength="100" onChange={(event) => setQueryInput(event.target.value)} />
          </label>
          <button type="submit">Search</button>
        </form>
        <label>Topic
        <select
          id="topicSelect"
          className={styles.dropdown}
          name="topicSelected"
          value={topicSelected}
          onChange={(event) => updateQuery("topic", event.target.value)}
          aria-label="Filter articles by topic"
        >
          <option value="">All topics</option>
          <option value="coding">Technology</option>
          <option value="cooking">Cooking</option>
          <option value="football">Football</option>
        </select>
        </label>
        <label>Sort by
        <select
          id="sortSelect"
          className={styles.dropdown}
          name="sortBySelected"
          value={sortBySelected}
          onChange={(event) => updateQuery("sort_by", event.target.value)}
          aria-label="Sort articles by"
        >
          <option value="created_at">Date</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="votes">Votes</option>
          <option value="comment_count">Comments</option>
        </select>
        </label>
        <div className={styles["order-field"]}><span>Order</span>
        <button className={styles["order-button"]} onClick={toggleOrder} aria-label={orderSelected === "asc" ? "Ascending order; switch to descending" : "Descending order; switch to ascending"}>
          <span className={styles["order-text"]}>{orderSelected === "asc" ? "Ascending " : "Descending "}</span><span aria-hidden="true">{orderSelected === "asc" ? "↑" : "↓"}</span>
        </button>
        </div>
        <span className={styles.catalogue}>CODE / FOOD / FOOTBALL</span>
      </div>
      {isLoading ? <div className={styles.notice} role="status"><strong>Finding your next read…</strong><p>The free demo API may take about a minute to wake.</p></div> : error ? (
        <p role="alert">
          {error} <button type="button" onClick={() => setRetryCount((count) => count + 1)}>Retry</button>
        </p>
      ) : articleList.length === 0 ? (
        <p>{totalCount ? "This page is beyond the available articles." : querySelected ? "No articles match this search." : "No articles match this selection."}</p>
      ) : (
        <ul className={styles["article-card-list"]}>
          {articleList.map((article) => (
            <li key={article.article_id} className={styles["article-card"]}>
              <Link
                to={"/articles/" + article.article_id}
                state={{ browseSearch: searchParams.toString() }}
                className={styles["article-card-link"]}
              >
                <ArticleCard {...article} />
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!isLoading && !error && (
        <nav className={styles.pagination} aria-label="Article pages">
          <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)}>Previous</button>
          <p role="status">Page {page} of {Math.max(1, Math.ceil(totalCount / 12))} · {totalCount} {totalCount === 1 ? "article" : "articles"}</p>
          <button type="button" disabled={page * 12 >= totalCount} onClick={() => goToPage(page + 1)}>Next</button>
          {page > Math.max(1, Math.ceil(totalCount / 12)) && <button type="button" onClick={() => goToPage(1)}>First page</button>}
        </nav>
      )}
    </main>
  );
};

export default ArticleList;
