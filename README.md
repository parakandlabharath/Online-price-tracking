# PricePulse India — Online Product Price Tracker

PricePulse is a browser-based watchlist for organizing products, target prices, and price observations. It includes a dashboard, filters, product details, JSON backup/restore, notifications, and an optional AI shopping assistant.

> **Project status: in development.** This repository contains a React/TypeScript frontend and an Express API. It does not currently have a verified retailer feed or automatic live price monitoring. AI analysis is not proof of a current retailer price.

## Current features

- Add products using an AI-assisted URL/query analysis endpoint (requires Gemini configuration).
- Store a personal watchlist and notifications in browser local storage.
- Search, filter, sort, favourite, update target prices, and remove tracked products.
- Export and import the watchlist as JSON; imported records are validated before replacing current data.
- View dashboard analytics and ask an optional AI shopping assistant.
- Request a price refresh; the API deliberately returns HTTP 501 until a verified price provider is integrated.

## Technology

- React 19 + TypeScript
- Vite 6
- Express 4
- Node.js 22
- Optional Google Gemini API

## Run locally

Prerequisites: Node.js 22 and npm.

```bash
git clone https://github.com/parakandlabharath/Online-price-tracking.git
cd Online-price-tracking/recovered-source
npm install
npm run dev
```

Open the local address printed in the terminal (normally `http://localhost:3000`).

Optional AI endpoints require `GEMINI_API_KEY`. Copy `.env.example` to `.env`, add the key locally, and never commit secrets.

## Validate changes

```bash
npm run lint
npm test
npm run build
```

GitHub Actions runs TypeScript checks, unit tests, and a production build for application changes.

## Data and accuracy notes

- Watchlist and notifications are stored in the current browser's local storage. They do not automatically sync between devices or users.
- JSON backup/restore is available. Keep backups somewhere separate from the laptop.
- The AI endpoint can return estimates and generated comparisons. Verify every price, availability, MRP, historical range, and retailer link on the retailer's own page before purchasing.
- The application does not yet collect verified historical prices.
- The refresh endpoint returns an explicit unavailable response rather than inventing a price movement.
- The current demo dataset is sample data and must not be mistaken for live offers.

## Architecture

```text
React dashboard
  ├── localStorage: watchlist + notifications
  ├── Product import/export validation
  └── Express API
        ├── /api/product/parse       optional AI-assisted analysis
        ├── /api/assistant/ask       optional AI shopping guidance
        └── /api/product/refresh-prices  intentionally unavailable (501)
```

## Completion checklist

- [x] Recovered source is organized under `recovered-source/`
- [x] Type-check and production build workflow
- [x] Validate imported watchlists before replacing current data
- [x] Unit tests for import validation
- [x] Avoid generating fake 30/60-day price-history observations
- [ ] Add verified retailer price provider(s) and source timestamps
- [ ] Persist user data beyond one browser/device (database + backup strategy)
- [ ] Add tests for product analysis/API error handling and alert thresholds
- [ ] Capture genuine screenshots from the running app in `screenshots/`
- [ ] Verify clean-clone installation and end-to-end user flows

## Interview explanation

The frontend keeps the user's watchlist in local storage and derives filtered/sorted dashboard views from that state. The Express API provides optional AI-assisted analysis and shopping guidance. A dedicated validation module checks imported JSON records before they can replace the current watchlist. Live retailer monitoring is not implemented yet; the refresh endpoint explicitly reports that limitation instead of fabricating new prices.
