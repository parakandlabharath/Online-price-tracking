<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c065b06e-8722-4d36-bf8e-df31625e5955

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Important limitations

- Product analysis requires a valid `GEMINI_API_KEY`. If it is missing or the AI request fails, the API now returns an error instead of inventing a product price.
- Live retailer price refresh is intentionally disabled. The previous implementation randomly changed prices and could present simulated values as live data.
- Product watchlists and notifications are stored in browser LocalStorage. They are local to that browser and are not backed up to a shared database.
- Demo products and historical price points are sample data, not verified retailer quotes.
- Do not use this application for purchase decisions until a retailer data provider, historical price store, and scheduled alert service are integrated.
