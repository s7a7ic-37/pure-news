import { Link } from "react-router-dom";
import { formatPostedAt } from "../utils/formatPostedAt";
import styles from "./SavedStories.module.css";

export default function SavedStories({ stories, onSaveStory }) {
  return (
    <main className={styles.saved}>
      <h2>Saved stories</h2>
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
              <button type="button" onClick={() => onSaveStory(story, false)} aria-label={`Remove ${story.title} from saved stories`}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
