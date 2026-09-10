import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div>
          <h1 className={styles.logo}><Link to="/">Pure <span>News.</span></Link></h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
