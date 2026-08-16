# Pure News

Pure News is a React news discussion app backed by a separate Express and PostgreSQL API. Readers can filter and sort articles, open article details, vote, and add comments. The frontend and API remain separate repositories with their original Git history.

## Run locally

Requirements: Node.js and a running Pure News API.

    npm ci
    npm run dev

By default the frontend uses the original hosted API at https://pure-news-api-1.onrender.com/api. To use another API, set VITE_API_URL to its base path, including /api, before starting Vite.

Run the vote and API-client checks with npm test. The frontend reverses an optimistic vote if the API rejects the update and shows retryable error states when data cannot be loaded. API-client tests also check query encoding, comment-response validation and error propagation without making network requests.

The reading-room interface uses the original React/Vite stack with CSS modules and system fonts. Topic, sort order and page live in URL parameters, so a URL can be shared or refreshed and browser Back restores the selection. Article links carry the browsing query to the return link. Invalid URL values fall back to known defaults. Changing a filter resets the page. The client requests 12 articles at a time from the API and uses filtered totals to disable unavailable pages; an out-of-range page offers a first-page recovery control. Pagination returns keyboard focus to the results heading. Filters remain available while a request is loading.

## Live status

The frontend is hosted at https://pure-news.netlify.app. The API's old database had been paused beyond dashboard restoration. A replacement Supabase database now serves the original public sample articles and comments. Article, topic, comment and user reads were verified successfully. The frontend retains readable errors and retry controls for future outages.

Netlify publishes Vite's `dist` directory. Keep the SPA fallback in `public/_redirects` so Vite copies it into that directory; direct article links and browser refreshes must serve `index.html`. CI checks that this routing file is included in the build.

Articles open immediately. This is a public learning demo, with sample identities rather than real authentication. The default identity is weegembump; Switch in the navigation opens the six sample choices. Do not enter personal information. The free API instance may take about a minute to wake after inactivity. Requests time out after 90 seconds, and article failures have a retry control; missing articles have a separate message.

## Source

- Frontend: https://github.com/s7a7ic-37/pure-news
- Backend: https://github.com/s7a7ic-37/pure-news-api
- Backend setup, database requirements, and API endpoints are documented in the API repository.

## Visual identity

The editorial interface has a warm burgundy identity, with a matching N tab mark in SVG/PNG/ICO formats and an Apple touch icon. The API serves the same ICO at its browser root. No external font or icon service is required.
