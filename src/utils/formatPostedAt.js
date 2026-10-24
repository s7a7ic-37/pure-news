export function formatPostedAt(value, now = Date.now()) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Date unavailable";

  const minutes = Math.floor(Math.max(0, now - timestamp) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return new Date(timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
