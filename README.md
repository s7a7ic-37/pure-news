# Pure News

Pure News is a React news discussion app backed by a separate Express and PostgreSQL API. Readers can filter and sort articles, open article details, vote, and add comments. The frontend and API remain separate repositories with their original Git history.

## Run locally

Requirements: Node.js and a running Pure News API.

    npm ci
    npm run dev

By default the frontend uses the original hosted API at https://pure-news-api-1.onrender.com/api. To use another API, set VITE_API_URL to its base path, including /api, before starting Vite.

Run the vote-delta checks with npm test. The frontend reverses an optimistic vote if the API rejects the update and shows retryable error states when data cannot be loaded.

## Live status

The frontend is hosted at https://pure-news.netlify.app. Restored on 30 October 2026: the API's old database had been paused beyond dashboard restoration. A replacement Supabase database now serves the original public sample articles and comments. Article, topic, comment and user reads were verified successfully. The frontend retains readable errors and retry controls for future outages.

This is a public learning demo, with sample usernames rather than real authentication. Use the sample username weegembump to try commenting; do not enter personal information. The free API instance may take about a minute to wake after inactivity.

## Source

- Frontend: https://github.com/s7a7ic-37/pure-news
- Backend: https://github.com/s7a7ic-37/pure-news-api
- Backend setup, database requirements, and API endpoints are documented in the API repository.
