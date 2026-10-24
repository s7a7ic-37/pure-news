import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import styles from "./Nav.module.css";

const Nav = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className={styles.nav}>
      <Link to="/home" className={styles["link-homepage"]}>
        All stories
      </Link>
      <p>
        <span className={styles.identity}>Reading as <b>{user}</b></span> <Link to="/demo-user">Switch identity ↗</Link>
      </p>
      <a href="https://portfolio.artemislab.co.uk/#projects">← All projects</a>
      <small>Public sample data · no authenticated accounts</small>
    </nav>
  );
};

export default Nav;
