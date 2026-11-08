import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import { UserContext } from "./contexts/UserContext";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import Nav from "./components/Nav";
import ArticleList from "./components/ArticleList";
import SingleArticle from "./components/SingleArticle";
import SavedStories from "./components/SavedStories";
import { SAVED_STORIES_KEY, parseSavedStories, setStorySaved, ReadingListError } from "./utils/savedStories";

function readReadingList() {
  try {
    return {stories: parseSavedStories(window.localStorage.getItem(SAVED_STORIES_KEY)), error: ""};
  } catch (error) {
    return {stories: [], error: error instanceof ReadingListError ? error.message : "Browser storage is unavailable. Saved stories could not be read."};
  }
}

function App() {
  const [user, setUser] = useState("weegembump");
  const [saved, setSaved] = useState(readReadingList);

  useEffect(() => {
    const sync = (event) => {
      if (event.key === SAVED_STORIES_KEY || event.key === null) setSaved(readReadingList());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function saveStory(article, shouldSave) {
    try {
      const current = parseSavedStories(window.localStorage.getItem(SAVED_STORIES_KEY));
      const next = setStorySaved(current, article, shouldSave);
      window.localStorage.setItem(SAVED_STORIES_KEY, JSON.stringify(next));
      setSaved({stories: next, error: ""});
    } catch (error) {
      setSaved((previous) => ({...previous, error: error instanceof ReadingListError ? error.message : "This change could not be saved in browser storage. Your previous reading list is unchanged."}));
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className={styles.container}>
        <a className={styles.skipLink} href="#page-content">Skip to content</a>
        <Header />
        <Nav savedCount={saved.stories.length} />
        <div id="page-content" tabIndex={-1}>
          {saved.error && <div className={styles.notice} role="alert"><p>{saved.error}</p><button type="button" onClick={() => setSaved(readReadingList())}>Retry reading list</button></div>}
          <Routes>
            <Route path="/" element={<ArticleList />} />
            <Route path="/demo-user" element={<SignIn />} />
            <Route path="/home" element={<ArticleList />} />
            <Route path="/articles/:article_id" element={<SingleArticle savedStories={saved.stories} onSaveStory={saveStory} />} />
            <Route path="/saved" element={<SavedStories stories={saved.stories} onSaveStory={saveStory} />} />
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
        <footer className={styles.footer}><strong>Pure News.</strong><a href="https://github.com/s7a7ic-37/pure-news">Frontend source ↗</a><a href="https://github.com/s7a7ic-37/pure-news-api">API source ↗</a></footer>
      </div>
    </UserContext.Provider>
  );
}

export default App;
