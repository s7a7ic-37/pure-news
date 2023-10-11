import styles from "./CommentCard.module.css";

const CommentCard = ({ body, author, votes, created_at }) => {
  const formattedDate = new Date(created_at).toLocaleString();

  return (
    <>
      <div className={styles["comment-author-date-box"]}>
        <p className={styles["comment-author"]}>{author}</p>
        <p className={styles["comment-date"]}>{formattedDate}</p>
      </div>
      <div className={styles["comment-body-votes-box"]}>
        <article className={styles["comment-body"]}>{body}</article>
        <p className={styles["comment-votes"]}>Votes: {votes}</p>
      </div>
    </>
  );
};

export default CommentCard;
