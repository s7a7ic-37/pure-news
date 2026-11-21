import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import listStyles from "./ArticleList.module.css";
import cardStyles from "./ArticleCard.module.css";
import styles from "./SampleEdition.module.css";

const stories = [
  {
    topic: "Technology",
    title: "A tool library maps its shelves",
    paragraphs: [
      "When a drill went back in the wrong cupboard, the next borrower had to search the whole room. The volunteers drew a floor map, numbered the shelves and added those numbers to the booking list.",
      "They tried it first with the most borrowed tools. A printed map stayed beside the door for anyone who preferred to leave their phone in their pocket.",
    ],
  },
  {
    topic: "Cooking",
    title: "A soup swap starts with spare jars",
    paragraphs: [
      "The neighbours each brought one pot to the courtyard. Everyone took a spoonful from a few pots, then picked a soup to take home. Handwritten tape on each jar listed the ingredients.",
      "Two visitors arrived empty-handed. The organisers found spare jars for them and put a box of extras aside for the next swap.",
    ],
  },
  {
    topic: "Football",
    title: "A walking football side puts its substitutes in charge",
    paragraphs: [
      "The six-a-side group kept losing track of whose turn it was to sit out. They put a whiteboard beside the pitch and asked the resting players to handle the rotation.",
      "One moved the names every four minutes while the other kept score. After the game, the board helped the group see who had played together and mix the sides for the next match.",
    ],
  },
];

export default function SampleEdition() {
  const { state } = useLocation();
  const heading = useRef(null);
  const backToFeed = {
    pathname: state?.browsePath === "/home" ? "/home" : "/",
    search: state?.browseSearch || "",
  };

  useEffect(() => { heading.current?.focus(); }, []);

  return (
    <main className={listStyles["article-list"]}>
      <Link className={styles.back} to={backToFeed}>← Back to live feed</Link>
      <h2 ref={heading} tabIndex={-1} className={listStyles["article-list-title"]}>Sample edition</h2>
      <p className={styles.note}>Three fictional stories in a read-only edition.</p>
      <ul className={listStyles["article-card-list"]}>
        {stories.map(story => (
          <li key={story.topic}>
            <article className={styles.story}>
              <div className={cardStyles.kicker}><span>{story.topic}</span></div>
              <h3 className={cardStyles["article-title"]}>{story.title}</h3>
              {story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
