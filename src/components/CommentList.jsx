import { useEffect, useState } from "react";
import { fetchCommentsByArticle } from "../utils/utils";
import CommentCard from "./CommentCard";
import PostComment from "./PostComment";
import styles from "./CommentList.module.css";

const CommentList = ({ article_id }) => {
  const [commentList, setCommentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchCommentsByArticle(article_id).then(({ comments }) => {
      setCommentList(comments);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <h2>Comments are loading...</h2>;

  return (
    <>
      <PostComment article_id={article_id} setCommentList={setCommentList} />
      <section className={styles["comment-list"]}>
        <h3 className={styles["comment-list-title"]}>Comments</h3>
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
