# Pure News

A React news discussion app with topic filters, sorting, pagination, article voting and comments.

**[Live app](https://pure-news.netlify.app/)** · **[API and setup](https://github.com/s7a7ic-37/pure-news-api)**

## Features

- Shareable article filters and page state, including browser Back support.
- Article details, comment threads and sample-user selection.
- Optimistic votes with rollback on failure.
- Loading, retry and missing-article states.

Built with React, React Router, Vite, Axios and CSS modules.

## Run locally

Requires Node.js 22 and a running Pure News API.

```sh
npm ci
npm run dev
```

The default API is `https://pure-news-api-1.onrender.com/api`. Set `VITE_API_URL` in an untracked `.env.local` file to use another API; include the `/api` path.

`npm test` runs vote and API-client checks. `npm run build` creates `dist/`. Netlify uses `public/_redirects` for direct article links.

## Demo notes

Sample usernames are not authenticated accounts. Avoid submitting personal information. The free API may take about a minute to wake after inactivity.
