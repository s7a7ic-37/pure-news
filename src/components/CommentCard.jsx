const CommentCard = ({ body, author, votes, created_at }) => {
  const formattedDate = new Date(created_at).toLocaleString();

  return (
    <>
      <h5 className="comment-author">{author}</h5>
      <p className="comment-date">{formattedDate}</p>
      <article className="comment-body">{body}</article>
      <p className="comment-votes">Votes: {votes}</p>
    </>
  );
};

export default CommentCard;
