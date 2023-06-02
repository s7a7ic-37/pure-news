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
  const [voteChange, setVoteChange] = useState(0);
  const [hasUpVoted, setHasUpVoted] = useState(false);
  const [hasDownVoted, setHasDownVoted] = useState(false);
  const [isError, setIsError] = useState(false);

  const upVote = () => {
    setHasDownVoted(false);
    if (voteChange === 0 || voteChange === -1) {
      const updatedVotes = newVotes + 1;
      setNewVotes(updatedVotes);
      setIsError(false);

      updateArticleVotes(article_id, { inc_votes: 1 }).catch(() => {
        setIsError(true);
      });
      if (voteChange === 0) {
        setVoteChange(1);
      } else {
        setVoteChange(0);
      }
    } else {
      setHasUpVoted(true);
    }
  };

  const downVote = () => {
    setHasUpVoted(false);
    if (voteChange === 0 || voteChange === 1) {
      setHasUpVoted(false);
      const updatedVotes = newVotes - 1;
      setNewVotes(updatedVotes);
      setIsError(false);

      updateArticleVotes(article_id, { inc_votes: -1 }).catch(() => {
        setIsError(true);
      });
      if (voteChange === 0) {
        setVoteChange(-1);
      } else {
        setVoteChange(0);
      }
    } else {
      setHasDownVoted(true);
    }
  };

  const upVoteButtonClassName = `vote-button ${
    hasUpVoted ? "highlight-button" : ""
  }`;
  const downVoteButtonClassName = `vote-button ${
    hasDownVoted ? "highlight-button" : ""
  }`;

  return (
    <section id="article-card-info">
      <h2 className="article-title">{title}</h2>
      <p className="article-author">Posted by {author}</p>
      <p className="article-topic">{topic}</p>
      <p className="article-date">Posted at {formattedDate}</p>
      <article className="article-body">{body}</article>
      <img className="article-image" src={article_img_url} alt={title} />
      <button
        className={upVoteButtonClassName}
        onClick={upVote}
        disabled={hasUpVoted}
      >+</button>
      <p className="article-votes">Votes: {newVotes}</p>
      <button
        className={downVoteButtonClassName}
        onClick={downVote}
        disabled={hasDownVoted}
      >-</button>
      {hasUpVoted && (<h3 className="error-message">You have already up-voted</h3>)}
      {hasDownVoted && (<h3 className="error-message">You have already down-voted</h3>)}
      {isError && <h3>Error has occurred, please try again later</h3>}
    </section>
  );
};

export default SingleArticleCard;
