import { Link } from "react-router-dom";
import { useRef } from "react";
import { formatPostedAt } from "../utils/formatPostedAt";
import styles from "./SavedStories.module.css";

export default function SavedStories({ stories, onSaveStory }) {
  const heading = useRef(null);
  function removeStory(event, story) {
    const row = event.currentTarget.closest("li");
    const next = row.nextElementSibling?.querySelector("a") || row.previousElementSibling?.querySelector("a");
    if (onSaveStory(story, false)) {
      requestAnimationFrame(() => (next?.isConnected ? next : heading.current)?.focus());
    }
  }
  return (
    <main className={styles.saved}>
      <h2 ref={heading} tabIndex={-1}>Saved stories</h2>
      <p className={styles.note}>Saved links in this browser. Articles still need the news service.</p>
      {!stories.length ? (
        <div className={styles.empty}>
          <p>Your reading list is empty. Save a story from its article page.</p>
          <Link to="/">Browse stories</Link>
        </div>
      ) : (
        <ul className={styles.list}>
          {stories.map((story) => (
            <li key={story.article_id}>
              <div>
                <Link to={`/articles/${story.article_id}`} state={{fromSaved: true}}>{story.title}</Link>
                <time dateTime={story.saved_at}>Saved {formatPostedAt(story.saved_at)}</time>
              </div>
              <button type="button" onClick={(event) => removeStory(event, story)} aria-label={`Remove ${story.title} from saved stories`}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
