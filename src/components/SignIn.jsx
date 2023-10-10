import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import styles from "./SignIn.module.css";

const SignIn = () => {
  const [signInInput, setSignInInput] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSignInInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setUser("weegembump");
    navigate("/home");
  };

  return (
    <div className={styles["sign-in-box"]}>
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <label htmlFor="sign-in" className={styles.label}>
          Please provide your username below
        </label>
        <input
          type="text"
          id="sign-in"
          value={signInInput}
          onChange={handleChange}
          placeholder="weegembump"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
