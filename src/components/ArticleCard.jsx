import styles from "./ArticleCard.module.css";
import { formatPostedAt } from "../utils/formatPostedAt";

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
      <div className={styles.kicker}><span>{topic === "coding" ? "Technology" : topic === "football" ? "Football" : "Cooking"}</span><time dateTime={created_at}>{formatPostedAt(created_at)}</time></div>
      <h3 className={styles["article-title"]}>{title}</h3>
      <p className={styles["article-author"]}>By {author}</p>
      <div className={styles["article-metadata"]}>
        <p className={styles["article-votes"]}>{votes} {Math.abs(votes) === 1 ? "vote" : "votes"}</p>
        <p className={styles["article-comment-count"]}>
          {comment_count} {comment_count === 1 ? "comment" : "comments"} ↗
        </p>
      </div>
      </div>
    </>
  );
};

export default ArticleCard;
