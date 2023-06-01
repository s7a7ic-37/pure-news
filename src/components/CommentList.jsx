import { useEffect, useState } from "react";
import { fetchCommentsByArticle } from "../utils/utils";
import CommentCard from "./CommentCard";

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
    <section className="comment-list">
      <h3 className="comment-list-title">Comments</h3>
      <ul className="comment-card-list">
        {commentList.map((comment) => {
          return (
            <li className="comment-card">
              <CommentCard key={comment.comment_id} {...comment} />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CommentList;
