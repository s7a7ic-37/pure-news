import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import { UserContext } from "./contexts/UserContext";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import Nav from "./components/Nav";
import ArticleList from "./components/ArticleList";
import SingleArticle from "./components/SingleArticle";

function App() {
  const [user, setUser] = useState("weegembump");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className={styles.container}>
        <Header />
        <Nav />
        <div>
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/demo-user" element={<SignIn />} />
            <Route path="/home" element={<ArticleList />} />
            <Route path="/articles/:article_id" element={<SingleArticle />} />
            <Route
              path="*"
              element={
                <main style={{ margin: "2rem auto", padding: "0 1rem" }}>
                  <h2>Page not found</h2>
                  <Link to="/">Browse articles</Link>
                </main>
              }
            />
          </Routes>
        </div>
        <footer className={styles.footer}><strong>Pure News.</strong><p>A learning project with public sample data. Sample identities are not authentication. Please keep personal information out of comments.</p><a href="https://github.com/s7a7ic-37/pure-news">Source ↗</a><a href="https://portfolio.artemislab.co.uk/">Maksymilian’s portfolio ↗</a></footer>
      </div>
    </UserContext.Provider>
  );
}

export default App;
