import { useState } from "react";
import { updateArticleVotes } from "../utils/utils";
import { getVoteUpdate } from "../utils/votes";
import styles from "./SingleArticleCard.module.css";
import { formatPostedAt } from "../utils/formatPostedAt";

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
  const formattedDate = formatPostedAt(created_at);

  const [newVotes, setNewVotes] = useState(votes);
  const [voteChange, setVoteChange] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isError, setIsError] = useState(false);

  const castVote = async (direction) => {
    if (isUpdating) return;
    const { nextChange, delta } = getVoteUpdate(voteChange, direction);
    if (!delta) return;

    const previousVotes = newVotes;
    const previousChange = voteChange;
    setNewVotes(previousVotes + delta);
    setVoteChange(nextChange);
    setIsError(false);
    setIsUpdating(true);

    try {
      await updateArticleVotes(article_id, { inc_votes: delta });
    } catch {
      setNewVotes(previousVotes);
      setVoteChange(previousChange);
      setIsError(true);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section
      id="article-card-container"
      className={styles["article-card-container"]}
    >
      <div className={styles["article-card-info"]}>
        <p className={styles["article-topic"]}>{topic}</p>
        <h2 className={styles["article-title"]}>{title}</h2>
        <div className={styles["post-data-box"]}>
          <p className={styles["article-author"]}>{author}</p>
          <time className={styles["article-date"]} dateTime={created_at}>{formattedDate}</time>
        </div>
        <img
          className={styles["article-image"]}
          src={article_img_url}
          alt=""
        />
        <article className={styles["article-body"]}>{body}</article>
        <div className={styles["vote-box"]}>
          <button
            type="button"
            className={styles["vote-button"]}
            onClick={() => castVote(1)}
            disabled={isUpdating}
            aria-pressed={voteChange === 1}
            aria-label="Upvote article"
          >
            +
          </button>
          <p className={styles["article-votes"]}>Votes: {newVotes}</p>
          <button
            type="button"
            className={styles["vote-button"]}
            onClick={() => castVote(-1)}
            disabled={isUpdating}
            aria-pressed={voteChange === -1}
            aria-label="Downvote article"
          >
            -
          </button>
        </div>
        {isUpdating && <p role="status" className={styles["error-message"]}>Saving vote…</p>}
        {isError && (
          <p className={styles["error-message"]} role="alert">
            Your vote could not be saved. Please try again.
          </p>
        )}
      </div>
    </section>
  );
};

export default SingleArticleCard;
