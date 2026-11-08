# Pure News

A React news discussion app with topic filters, sorting, pagination, article voting and comments.

**[Live app](https://news.artemislab.co.uk/)** · **[API and setup](https://github.com/s7a7ic-37/pure-news-api)**

## Features

- Shareable text/topic filters, sort order and page state, including browser Back support.
- Article details, comment threads and sample-user selection.
- A browser-local reading list of up to 50 saved links, with cross-tab updates and safe storage-failure states. Keyboard focus stays in the list after removal. Full articles still load from the API; saved links do not belong to sample identities.
- Response checks keep malformed API data out of the interface. Failed reads offer retry; an unconfirmed comment keeps its draft.
- Optimistic votes with rollback on failure.
- Loading, retry and missing-article states.

Built with React, React Router, Vite, Axios and CSS modules.

## Run locally

Requires Node.js 22.12 or newer and a running Pure News API.

```sh
npm ci
npm run dev
```

The default API is `https://news.artemislab.co.uk/api`. Set `VITE_API_URL` in an untracked `.env.local` file to use another API; include the `/api` path. Search matches a case-insensitive phrase in article titles or bodies and can be combined with topic, sort and page filters.

`npm test` runs vote, API-client and proxy checks. `npm run lint` checks the React source. `npm run build` creates `dist/`. Cloudflare hosts the frontend and forwards `/api` requests to the existing Express service on Render; its static-assets configuration handles page routes.

For the built-app browser regressions, run `npx playwright install --only-shell chromium webkit` once, then `npm run test:browser`. Chromium desktop/mobile and mobile WebKit tests check saved-link persistence, cross-tab updates, storage failures, global styling, comment submissions and vote switching/rollback. They use synthetic intercepted API responses, so no public votes or comments are written. CI runs these checks too. Browser emulation does not replace physical-device testing.

## Demo notes

Sample usernames are not authenticated accounts. Avoid submitting personal information. The free API may take about a minute to wake after inactivity.
