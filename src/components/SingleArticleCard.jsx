import { useState } from "react";
import { updateArticleVotes } from "../utils/utils";
import styles from "./SingleArticleCard.module.css";

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
    <section
      id="article-card-container"
      className={styles["article-card-container"]}
    >
      <div className={styles["article-card-info"]}>
        <h2 className={styles["article-title"]}>{title}</h2>
        <p className={styles["article-topic"]}>{topic}</p>
        <div className={styles["post-data-box"]}>
          <p className={styles["article-author"]}>{author}</p>
          <p className={styles["article-date"]}>{formattedDate}</p>
        </div>
        <article className={styles["article-body"]}>{body}</article>
        <img
          className={styles["article-image"]}
          src={article_img_url}
          alt={title}
        />
        <div className={styles["vote-box"]}>
          <button
            className={`${styles["vote-button"]} ${
              hasUpVoted ? styles["highlight-button"] : ""
            }`}
            onClick={upVote}
            disabled={hasUpVoted}
          >
            +
          </button>
          <p className={styles["article-votes"]}>Votes: {newVotes}</p>
          <button
            className={`${styles["vote-button"]} ${
              hasDownVoted ? styles["highlight-button"] : ""
            }`}
            onClick={downVote}
            disabled={hasDownVoted}
          >
            -
          </button>
        </div>
        <div className={styles["error-message-container"]}>
          {hasUpVoted && (
            <h3 className={styles["error-message"]}>
              You have already up-voted
            </h3>
          )}
          {hasDownVoted && (
            <h3 className={styles["error-message"]}>
              You have already down-voted
            </h3>
          )}
          {isError && (
            <p className={styles["error-message"]}>
              Error has occurred, please try again later
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SingleArticleCard;
