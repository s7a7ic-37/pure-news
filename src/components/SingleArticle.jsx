import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArticleById } from "../utils/utils";
import SingleArticleCard from "./SingleArticleCard";
import CommentList from "./CommentList";
import styles from "./SingleArticle.module.css";

const SingleArticle = () => {
  const [presentArticle, setPresentArticle] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { article_id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetchArticleById(article_id).then(({ article }) => {
      setPresentArticle(article);
      setIsLoading(false);
    });
  }, [article_id]);

  if (isLoading) return <h2>Your page is loading...</h2>;

  return (
    <main className={styles["single-article-card"]}>
      <SingleArticleCard presentArticle={presentArticle} />
      <CommentList article_id={article_id} />
    </main>
  );
};

export default SingleArticle;
