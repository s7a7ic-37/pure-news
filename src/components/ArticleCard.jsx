import styles from "./ArticleCard.module.css";

const ArticleCard = ({
  author,
  title,
  article_img_url,
  votes,
  comment_count,
}) => {
  return (
    <>
      <h3 className={styles["article-title"]}>{title}</h3>
      <p className={styles["article-author"]}>By: {author}</p>
      <img
        src={article_img_url}
        alt={title}
        className={styles["article-image"]}
      />
      <p className={styles["article-votes"]}>Votes: {votes}</p>
      <p className={styles["article-comment-count"]}>
        Comments: {comment_count}
      </p>
    </>
  );
};

export default ArticleCard;
