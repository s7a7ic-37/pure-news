import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { addComment } from "../utils/utils";
import styles from "./PostComment.module.css";
import { isCommentValid } from "../utils/comments";

const PostComment = ({ article_id, setCommentList }) => {
  const { user } = useContext(UserContext);
  const [commentInput, setCommentInput] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [isInputCorrect, setIsInputCorrect] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isCommentValid(commentInput)) {
      setIsInputCorrect(false);
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const comment = await addComment(article_id, user, commentInput);
      setCommentList((presentComments) => [comment, ...presentComments]);
      setCommentInput("");
      setIsPosted(true);
      setIsError(false);
      setIsInputCorrect(true);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => {
    setCommentInput(event.target.value);
    setIsPosted(false);
    setIsInputCorrect(true);
  };

  return (
    <section className={styles["submit-comment"]}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-comment" className={styles["new-comment-label"]}>
          Comment as {user}
        </label>
        <div className={styles["new-comment-box"]}>
          <textarea
            name="add-comment"
            id="new-comment"
            cols="50"
            rows="5"
            value={commentInput}
            disabled={isSubmitting}
            onChange={handleChange}
            required
            maxLength={2000}
            aria-invalid={!isInputCorrect}
            aria-describedby={!isInputCorrect ? "comment-validation" : undefined}
          ></textarea>
          <button
            type="submit"
            className={styles["add-comment-button"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      <div className={styles["message-container"]}>
        {isError && (
          <p className={styles["error-message"]} role="alert">
            Your comment could not be confirmed. Check the discussion before submitting again.
          </p>
        )}
        {isPosted && (
          <p className={styles["comment-posted"]} role="status">
            Your comment has been posted
          </p>
        )}
        {!isInputCorrect && (
          <p id="comment-validation" className={styles["error-message"]} role="alert">
            Use 3–2000 characters, excluding leading and trailing spaces from the minimum.
          </p>
        )}
      </div>
    </section>
  );
};

export default PostComment;
