import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div>
          <p className={styles.eyebrow}>THE PUBLIC SAMPLE EDITION</p>
          <h1 className={styles.logo}><Link to="/">Pure <span>News.</span></Link></h1>
        </div>
        <p className={styles.tagline}>Good stories.<br />Different perspectives.</p>
      </div>
    </header>
  );
};

export default Header;
