import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import { UserContext } from "./contexts/UserContext";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import Nav from "./components/Nav";
import ArticleList from "./components/ArticleList";
import SingleArticle from "./components/SingleArticle";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const [user, setUser] = useState("weegembump");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className={styles.container}>
        <Header />
        {!isLoginPage && <Nav />}
        <div>
          <Routes>
            <Route path="/" element={<SignIn setUser={setUser} />} />
            <Route path="/home" element={<ArticleList />} />
            <Route path="/articles/:article_id" element={<SingleArticle />} />
          </Routes>
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
