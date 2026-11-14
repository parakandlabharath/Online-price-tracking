# PricePulse India application source

This folder contains the React + TypeScript frontend and Express server.

For the verified feature list, setup commands, data limitations and architecture, see the [repository README](../README.md).

## Run locally

Requirements: Node.js 22 and npm.

```bash
npm install
npm run dev
```

## Validate

```bash
npm run lint
npm test
npm run build
```

Optional Gemini features read `GEMINI_API_KEY` from the environment. Keep local environment files private.

**Price accuracy note:** retailer price refresh is not implemented. The refresh API returns HTTP 501 rather than inventing a new price. Sample data and AI-generated estimates are not verified live retailer offers.
