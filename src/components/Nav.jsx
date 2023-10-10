import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import styles from "./Nav.module.css";

const Nav = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className={styles.nav}>
      <Link to="/home" className={styles["link-homepage"]}>
        Homepage
      </Link>
      <p>
        <b>Logged in as:</b> {user}
      </p>
    </nav>
  );
};

export default Nav;
