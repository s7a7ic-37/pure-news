import { useState } from "react";
import { updateArticleVotes } from "../utils/utils";

const SingleArticleCard = ({ presentArticle }) => {
  const {
    article_id,
    title,
    author,
    topic,
    created_at,
    body,
    votes,
    article_img_url,
  } = presentArticle;
  const formattedDate = new Date(created_at).toLocaleString();

  const [newVotes, setNewVotes] = useState(votes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isError, setIsError] = useState(false);

  const changeVotes = (value) => {
    if (!hasVoted) {
      const updatedVotes = newVotes + value;
      setNewVotes(updatedVotes);
      setIsError(false);

      updateArticleVotes(article_id, { inc_votes: value })
      .catch(() => {
        setIsError(true)
      });
      
      setHasVoted(true);
    }
  };

  return (
    <section id="article-card-info">
      <h2 className="article-title">{title}</h2>
      <p className="article-author">Posted by {author}</p>
      <p className="article-topic">{topic}</p>
      <p className="article-date">Posted at {formattedDate}</p>
      <article className="article-body">{body}</article>
      <img className="article-image" src={article_img_url} alt={title} />
      <button className="vote-button" onClick={() => changeVotes(1)}>+</button>
      <p className="article-votes">Votes: {newVotes}</p>
      <button className="vote-button" onClick={() => changeVotes(-1)}>-</button>
      {isError && <h3>Error has occurred, please try again later</h3>}  
    </section>
  );
};

export default SingleArticleCard;
