# Learning notes — PricePulse India

These notes describe the current TypeScript/React application.

## 1. React components
- **Meaning:** Components split the interface into reusable pieces.
- **Used here:** `recovered-source/src/App.tsx` and `src/components/`.
- **Tiny example:** A product card receives a product as a prop and renders its title and price.
- **Common mistake:** Duplicating the same product display markup across multiple screens.

## 2. TypeScript types
- **Meaning:** Types describe the expected structure of data.
- **Used here:** `recovered-source/src/types.ts` and `src/lib/productValidation.ts`.
- **Tiny example:** `type Product = { title: string; currentPrice: number };`
- **Common mistake:** Assuming a TypeScript type validates JSON received at runtime.

## 3. Input validation and type guards
- **Meaning:** Runtime validation checks unknown data before the app trusts it.
- **Used here:** `src/lib/productValidation.ts`.
- **Tiny example:** Check that an imported record has a non-empty title and a finite, non-negative price.
- **Common mistake:** Trusting a parsed JSON object without checking its nested fields.

## 4. Collections and array methods
- **Meaning:** Arrays store lists; `filter`, `map` and `sort` help derive views.
- **Used here:** product and notification state in `src/App.tsx` and dashboard components.
- **Tiny example:** `products.filter((product) => product.isFavorite)`
- **Common mistake:** Sorting the original state array in place when a derived copy is needed.

## 5. Browser local storage
- **Meaning:** Local storage stores string data in one browser profile.
- **Used here:** the watchlist and notification state in the frontend.
- **Tiny example:** `localStorage.setItem('watchlist', JSON.stringify(products));`
- **Common mistake:** Expecting browser-local data to synchronise across devices.

## 6. JSON import and export
- **Meaning:** JSON turns objects into portable text and can reconstruct objects later.
- **Used here:** `src/components/ExportImportModal.tsx` and `src/lib/productValidation.ts`.
- **Tiny example:** `JSON.stringify(products, null, 2)`
- **Common mistake:** Overwriting the existing watchlist before the imported file passes validation.

## 7. REST API calls
- **Meaning:** A frontend sends HTTP requests to backend routes and handles their responses.
- **Used here:** `src/services/api.ts` and `recovered-source/server.ts`.
- **Tiny example:** `fetch('/api/health')`
- **Common mistake:** Treating every non-2xx HTTP response as success.

## 8. Express server
- **Meaning:** Express is a Node.js framework for handling HTTP routes.
- **Used here:** `recovered-source/server.ts`.
- **Tiny example:** `app.get('/api/health', handler)`
- **Common mistake:** Putting provider credentials in frontend code rather than server environment variables.

## 9. AI API integration
- **Meaning:** The server sends a prompt to an external AI service and handles the response.
- **Used here:** `recovered-source/server.ts`, with the key read from `GEMINI_API_KEY`.
- **Tiny example:** Check whether the API key exists before constructing the AI client.
- **Common mistake:** Treating AI-generated product details as verified retailer facts.

## 10. Unit tests
- **Meaning:** Unit tests check a small function against expected results.
- **Used here:** `src/lib/productValidation.test.ts`.
- **Tiny example:** Reject an imported product with an invalid price or URL.
- **Common mistake:** Testing only a valid product and ignoring malformed nested data.

## Important boundary
Product watchlists are browser-local. The refresh-prices endpoint returns HTTP 501 until a verified retailer provider exists. Sample product data and AI estimates are not a verified price history.
