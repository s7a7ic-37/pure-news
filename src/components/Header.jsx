import React from "react";
import styles from "./Header.module.css";

const Header = () => {
  const headerText = "Pure News";
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>{headerText}</h1>
    </header>
  );
};

export default Header;
