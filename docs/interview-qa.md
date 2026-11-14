# Interview preparation — PricePulse India

## 60-second project pitch

“PricePulse India is a product watchlist and price-observation interface built with React and TypeScript, supported by an Express API. Users can organise products, set target prices, search and filter the watchlist, review dashboard summaries, and export or import their data as JSON. I separated product validation into a utility module and added tests so imported records are checked before being used. The watchlist currently lives in browser local storage. Automatic verified retailer price collection is not implemented, so the refresh API clearly reports that it is unavailable instead of fabricating prices.”

## How it works — about two minutes

1. The React application loads the product watchlist and notification state from the browser.
2. Components display product cards, details, filters, analytics and alerts from the current application state.
3. User actions add, update, favourite, filter or remove products.
4. The export/import flow converts data to JSON and validates imported product records before restoring them.
5. The frontend uses an API service module to communicate with the Express server.
6. The Express server exposes health and optional AI-assisted analysis endpoints. The Gemini key is read on the server from an environment variable.
7. The price refresh route currently returns HTTP 501 because a verified retailer provider is not connected.
8. The user must verify any product price or availability on the retailer's own website.

## 15 fresher-level questions

1. **What is PricePulse?** A product watchlist application for organising products and target prices.
2. **Why React?** It supports reusable UI components and state-driven rendering.
3. **What is TypeScript?** JavaScript with static typing.
4. **What is a component prop?** Data passed from a parent component to a child component.
5. **What is state?** Data that can change and cause the UI to render again.
6. **What is local storage?** Browser storage for string values that remain between visits in the same browser profile.
7. **Why use JSON export/import?** It gives users a portable manual backup of their watchlist.
8. **Why validate imported data?** JSON syntax does not guarantee that fields or nested records are valid.
9. **What is a type guard?** A runtime check that narrows an unknown value to a known type.
10. **What does `Array.filter()` do?** It returns a new array containing elements that pass a condition.
11. **What is a REST API?** An HTTP interface through which a client requests or updates resources.
12. **Why use Express?** It provides route handling for the Node.js backend.
13. **How is the Gemini key protected?** The server reads it from an environment variable rather than exposing it in frontend source.
14. **Does the app automatically track live retailer prices?** No. The refresh endpoint returns HTTP 501 until a verified provider is integrated.
15. **What would you improve next?** Add retailer integrations with source timestamps, durable storage, alert scheduling and tests for API failure paths.

## Interview honesty checklist

- Do not describe AI estimates as verified prices.
- Do not claim live retailer refresh or automatic history collection.
- Watchlist data is stored in browser local storage, not a shared database.
- Sample products and historical observations are demo data.
