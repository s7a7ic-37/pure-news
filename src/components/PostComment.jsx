import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { addComment } from "../utils/utils";
import styles from "./PostComment.module.css";

const PostComment = ({ article_id, setCommentList }) => {
  const { user } = useContext(UserContext);
  const [commentInput, setCommentInput] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [isInputCorrect, setIsInputCorrect] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isInputValid = (input) => {
    const inputLength = (input.match(/[a-zA-Z0-9]/g) || []).length;
    return inputLength >= 3;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isInputValid(commentInput)) {
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
  };

  return (
    <section className={styles["submit-comment"]}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-comment">Add your comment </label>
        <textarea
          name="add-comment"
          id="new-comment"
          cols="50"
          rows="5"
          value={commentInput}
          onChange={handleChange}
          required
        ></textarea>
        <button
          type="submit"
          className={styles["add-comment-button"]}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {isError && (
        <p className={styles["error-message"]}>
          Error has occurred, please try again later
        </p>
      )}
      {isPosted && (
        <p className={styles["comment-posted"]}>Your comment has been posted</p>
      )}
      {!isInputCorrect && (
        <p className={styles["error-message"]}>
          Your comment should be at least 3 characters long
        </p>
      )}
    </section>
  );
};

export default PostComment;
