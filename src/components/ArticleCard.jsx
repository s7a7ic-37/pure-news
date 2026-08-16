import styles from "./ArticleCard.module.css";

const ArticleCard = ({
  author,
  title,
  article_img_url,
  votes,
  comment_count,
  topic,
  created_at,
}) => {
  return (
    <>
      <img
        loading="lazy"
        decoding="async"
        src={article_img_url}
        alt=""
        className={styles["article-image"]}
      />
      <div className={styles.copy}>
      <div className={styles.kicker}><span>{topic === "coding" ? "Technology" : topic === "football" ? "Football" : "Cooking"}</span><time dateTime={created_at}>{new Date(created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</time></div>
      <h3 className={styles["article-title"]}>{title}</h3>
      <p className={styles["article-author"]}>By {author}</p>
      <div className={styles["article-metadata"]}>
        <p className={styles["article-votes"]}>{votes} votes</p>
        <p className={styles["article-comment-count"]}>
          {comment_count} comments ↗
        </p>
      </div>
      </div>
    </>
  );
};

export default ArticleCard;
