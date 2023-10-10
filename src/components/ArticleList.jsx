import { useEffect, useState } from "react";
import { fetchAllArticles } from "../utils/utils";
import ArticleCard from "./ArticleCard";
import { Link } from "react-router-dom";
import styles from "./ArticleList.module.css";

const ArticleList = () => {
  const [articleList, setArticleList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topicSelected, setTopicSelected] = useState("");
  const [sortBySelected, setSortBySelected] = useState("");
  const [orderSelected, setOrderSelected] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchAllArticles(topicSelected, sortBySelected, orderSelected).then(
      ({ articles }) => {
        setArticleList(articles);
        setIsLoading(false);
      }
    );
  }, [topicSelected, sortBySelected, orderSelected]);

  const handleTopicChange = (event) => {
    setTopicSelected(event.target.value);
  };

  const handleSortByChange = (event) => {
    setSortBySelected(event.target.value);
  };

  const toggleOrder = () => {
    const newOrder = orderSelected === "asc" ? "desc" : "asc";
    setOrderSelected(newOrder);
  };

  if (isLoading) return <h2>Your page is loading...</h2>;

  return (
    <main className={styles["article-list"]}>
      <h2 className={styles["article-list-title"]}>Popular articles</h2>
      <label htmlFor="topicSelect" className={styles["dropdown-label"]}>
        Select a topic:
      </label>
      <select
        id="topicSelect"
        className={styles.dropdown}
        name="topicSelected"
        value={topicSelected}
        onChange={handleTopicChange}
      >
        <option value="">ALL</option>
        <option value="coding">TECHNOLOGY</option>
        <option value="cooking">COOKING</option>
        <option value="football">SPORTS</option>
      </select>
      <label htmlFor="sortSelect" className={styles["dropdown-label"]}>
        Sort by:
      </label>
      <select
        id="sortSelect"
        className={styles.dropdown}
        name="sortBySelected"
        value={sortBySelected}
        onChange={handleSortByChange}
      >
        <option value="created_at">DATE</option>
        <option value="title">TITLE</option>
        <option value="author">AUTHOR</option>
        <option value="votes">VOTES</option>
        <option value="comment_count">COMMENTS</option>
      </select>
      <button className={styles["order-button"]} onClick={toggleOrder}>
        ORDER {orderSelected === "asc" ? "↑" : "↓"}
      </button>
      <ul className={styles["article-card-list"]}>
        {articleList.map((article) => (
          <li key={article.article_id} className={styles["article-card"]}>
            <Link
              to={`/articles/${article.article_id}`}
              className={styles["article-card-link"]}
            >
              <ArticleCard {...article} />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ArticleList;
