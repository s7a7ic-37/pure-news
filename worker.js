export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      url.host = "pure-news-api-1.onrender.com";
      url.protocol = "https:";
      try {
        return await fetch(new Request(url, request));
      } catch {
        return Response.json({ message: "News service temporarily unavailable." }, { status: 503 });
      }
    }
    return env.ASSETS.fetch(request);
  },
};
