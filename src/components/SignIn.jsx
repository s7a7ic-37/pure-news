import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import styles from "./SignIn.module.css";

const SignIn = () => {
  const { user, setUser } = useContext(UserContext);
  const [signInInput, setSignInInput] = useState(user);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSignInInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUser(signInInput);
    navigate("/home");
  };

  return (
    <div className={styles["sign-in-box"]}>
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <label htmlFor="sign-in" className={styles.label}>
          Choose a sample identity. This is not account sign-in.
        </label>
        <select
          id="sign-in"
          required
          value={signInInput}
          onChange={handleChange}
          className={styles.input}
        >
          {[
            "weegembump",
            "jessjelly",
            "grumpy19",
            "tickle122",
            "cooljmessy",
            "happyamy2016",
          ].map((username) => (
            <option key={username} value={username}>
              {username}
            </option>
          ))}
        </select>
        <p>
          All six names belong to the public sample dataset. Do not post
          personal information.
        </p>
        <button type="submit" className={styles.button}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default SignIn;
