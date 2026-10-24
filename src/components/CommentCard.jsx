import styles from "./CommentCard.module.css";
import { formatPostedAt } from "../utils/formatPostedAt";

const CommentCard = ({ body, author, votes, created_at }) => {
  const formattedDate = formatPostedAt(created_at);

  return (
    <>
      <div className={styles["comment-author-date-box"]}>
        <p className={styles["comment-author"]}>{author}</p>
        <time className={styles["comment-date"]} dateTime={created_at}>{formattedDate}</time>
      </div>
      <div className={styles["comment-body-votes-box"]}>
        <article className={styles["comment-body"]}>{body}</article>
        <p className={styles["comment-votes"]}>Votes: {votes}</p>
      </div>
    </>
  );
};

export default CommentCard;
