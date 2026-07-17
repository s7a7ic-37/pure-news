# Pure News

Pure News is a React news discussion app backed by a separate Express and PostgreSQL API. Readers can filter and sort articles, open article details, vote, and add comments. The frontend and API remain separate repositories with their original Git history.

## Run locally

Requirements: Node.js and a running Pure News API.

    npm ci
    npm run dev

By default the frontend uses the original hosted API at https://pure-news-api-1.onrender.com/api. To use another API, set VITE_API_URL to its base path, including /api, before starting Vite.

Run the vote-delta checks with npm test. The frontend reverses an optimistic vote if the API rejects the update and shows retryable error states when data cannot be loaded.

## Live status

The frontend is hosted at https://pure-news.netlify.app. On 30 October 2026 the API route catalogue responded, but topics and article routes returned HTTP 500. The exact production cause is not confirmed. The app now presents a readable error and retry instead of trying to render missing data.

## Source

- Frontend: https://github.com/s7a7ic-37/pure-news
- Backend: https://github.com/s7a7ic-37/pure-news-api
- Backend setup, database requirements, and API endpoints are documented in the API repository.
