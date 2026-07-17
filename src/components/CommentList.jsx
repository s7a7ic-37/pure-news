import { useEffect, useState } from "react";
import { fetchCommentsByArticle } from "../utils/utils";
import CommentCard from "./CommentCard";
import PostComment from "./PostComment";
import styles from "./CommentList.module.css";

const CommentList = ({ article_id }) => {
  const [commentList, setCommentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;
    setIsLoading(true);
    setError(false);

    fetchCommentsByArticle(article_id)
      .then(({ comments }) => {
        if (!Array.isArray(comments)) throw new Error("Invalid comments response");
        if (isCurrentRequest) setCommentList(comments);
      })
      .catch(() => {
        if (isCurrentRequest) {
          setCommentList([]);
          setError(true);
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [article_id, retryCount]);

  if (isLoading) return <p role="status">Comments are loading…</p>;

  if (error) {
    return (
      <section className={styles["comment-list"]}>
        <p role="alert">Comments could not be loaded right now.</p>
        <button type="button" onClick={() => setRetryCount((count) => count + 1)}>Retry comments</button>
      </section>
    );
  }

  return (
    <>
      <PostComment article_id={article_id} setCommentList={setCommentList} />
      <h3 className={styles["comment-list-title"]}>Comments</h3>
      <section className={styles["comment-list"]}>
        {commentList.length === 0 ? (
          <p>No comments to display</p>
        ) : (
          <ul className={styles["comment-card-list"]}>
            {commentList.map((comment) => (
              <li className={styles["comment-card"]} key={comment.comment_id}>
                <CommentCard {...comment} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default CommentList;
