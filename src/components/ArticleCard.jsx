const ArticleCard = ({author, title, article_img_url, votes, comment_count}) => {
  return (
    <>
      <h3 className="article-title">{title}</h3>
      <h4 className="article-author">{author}</h4>
      <img className="article-image" src={article_img_url} alt={`${title}`} />
      <p className="article-votes">Votes: {votes}</p>
      <p className="article-comment-count">Comments: {comment_count}</p>
    </>
  );
};

export default ArticleCard;
