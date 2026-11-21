const keyName = "pure-news.article-snapshots.v1";
const maxAge = 6 * 60 * 60 * 1000;
const maxEntries = 8;
const maxEntrySize = 64 * 1024;

function snapshots(storage) {
  try {
    const saved = JSON.parse(storage.getItem(keyName));
    const now = Date.now();
    return Array.isArray(saved) ? saved.slice(0, maxEntries).filter(entry =>
      entry && typeof entry.key === "string" && Number.isFinite(entry.at) &&
      entry.at <= now && now - entry.at <= maxAge
    ) : [];
  } catch {
    return [];
  }
}

export function readArticleSnapshot(key) {
  try {
    return snapshots(window.sessionStorage).find(entry => entry.key === key);
  } catch {
    return undefined;
  }
}

export function updateArticleSnapshot(key, data) {
  try {
    const storage = window.sessionStorage;
    const entries = snapshots(storage).filter(entry => entry.key !== key);
    const entry = { key, data, at: Date.now() };
    if (data && JSON.stringify(entry).length <= maxEntrySize) entries.unshift(entry);
    storage.setItem(keyName, JSON.stringify(entries.slice(0, maxEntries)));
  } catch {
    // Losing the optional snapshot must never stop a live article read.
  }
}
