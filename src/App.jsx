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
      </div>
    </UserContext.Provider>
  );
}

export default App;
