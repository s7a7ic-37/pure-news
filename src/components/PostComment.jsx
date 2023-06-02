import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { addComment } from "../utils/utils";

const PostComment = ({ article_id, setCommentList }) => {
  const { user } = useContext(UserContext);
  const [commentInput, setCommentInput] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [isInputCorrect, setIsInputCorrect] = useState(true);

  const isInputValid = (input) => {
    const inputLength = input.match(/[a-zA-Z0-9]/g).length;
    return inputLength >= 3;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isInputValid(commentInput)) {
      setIsInputCorrect(false);
      return;
    }

    addComment(article_id, user, commentInput)
      .then((comment) => {
        setCommentList((presentComments) => {
          return [comment, ...presentComments];
        });

        setCommentInput("");
        setIsPosted(true);
        setIsError(false);
        setIsInputCorrect(true);
      })
      .catch(() => setIsError(true));

    setIsPosted(false);
  };

  const handleChange = (event) => {
    setCommentInput(event.target.value);
    setIsPosted(false);
  };

  return (
    <section className="submit-comment">
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
        <button type="submit" className="add-comment-button">
          Submit
        </button>
      </form>
      {isError && (
        <p className="error-message">
          Error has occurred, please try again later
        </p>
      )}
      {isPosted && (
        <p className="comment-posted">Your comment has been posted</p>
      )}
      {!isInputCorrect && (
        <p className="error-message">
          Your comment should be at least 3 characters long
        </p>
      )}
    </section>
  );
};

export default PostComment;
