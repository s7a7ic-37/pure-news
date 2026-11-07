export const SAVED_STORIES_KEY = "pure-news-saved-stories-v1";
export const SAVED_STORIES_LIMIT = 50;
export class ReadingListError extends Error {}

export function parseSavedStories(raw) {
  if (raw === null) return [];
  try {
    const stories = JSON.parse(raw);
    if (!Array.isArray(stories) || stories.length > SAVED_STORIES_LIMIT)
      throw new Error("Invalid list");
    const ids = new Set();
    return stories.map((story) => {
      if (!story || !Number.isSafeInteger(story.article_id) || story.article_id < 1 ||
          ids.has(story.article_id) || typeof story.title !== "string" ||
          !story.title.trim() || story.title.length > 1000 ||
          typeof story.saved_at !== "string" || story.saved_at.length > 40 ||
          !Number.isFinite(Date.parse(story.saved_at))) throw new Error("Invalid story");
      ids.add(story.article_id);
      return {article_id: story.article_id, title: story.title, saved_at: story.saved_at};
    });
  } catch {
    throw new ReadingListError("The stored reading list could not be read. It has not been replaced.");
  }
}

export function setStorySaved(stories, article, shouldSave) {
  if (!Number.isSafeInteger(article.article_id) || article.article_id < 1)
    throw new ReadingListError("This story could not be saved.");
  if (!shouldSave)
    return stories.filter((story) => story.article_id !== article.article_id);
  if (stories.some((story) => story.article_id === article.article_id)) return stories;
  if (stories.length >= SAVED_STORIES_LIMIT)
    throw new ReadingListError("You can save up to 50 stories. Remove one first.");
  if (typeof article.title !== "string" || !article.title.trim() || article.title.length > 1000)
    throw new ReadingListError("This story could not be saved.");
  return [{article_id: article.article_id, title: article.title, saved_at: new Date().toISOString()}, ...stories];
}
