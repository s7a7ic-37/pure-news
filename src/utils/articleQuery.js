export function readArticleQuery(params) {
  const topic = params.get("topic") || "";
  const sortBy = params.get("sort_by") || "created_at";
  const page = params.get("p") || "1";
  return {
    topic: ["coding", "cooking", "football"].includes(topic) ? topic : "",
    sortBy: ["created_at", "title", "author", "votes", "comment_count"].includes(sortBy) ? sortBy : "created_at",
    order: params.get("order") === "asc" ? "asc" : "desc",
    page: /^[1-9]\d*$/.test(page) && Number(page) <= 100000 ? Number(page) : 1,
  };
}

export function updateArticleQuery(params, key, value) {
  const next = new URLSearchParams(params);
  if (value && !(key === "p" && value === "1")) next.set(key, value);
  else next.delete(key);
  if (key !== "p") next.delete("p");
  return next;
}
