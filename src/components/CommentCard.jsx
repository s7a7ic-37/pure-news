import { useState } from "react";
import styles from "./CommentCard.module.css";

const CommentCard = ({ body, author, votes, created_at }) => {
  const formattedDate = new Date(created_at).toLocaleString();

  return (
    <>
      <h4 className={styles["comment-author"]}>{author}</h4>
      <p className={styles["comment-date"]}>{formattedDate}</p>
      <article className={styles["comment-body"]}>{body}</article>
      <p className={styles["comment-votes"]}>Votes: {votes}</p>
    </>
  );
};

export default CommentCard;
