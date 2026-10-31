import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper for server-side Gemini client
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing from environment. Using intelligent fallback mode.');
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }

  // API 1: Parse product URL or Search query with Gemini & Web Grounding
  app.post('/api/product/parse', async (req, res) => {
    try {
      const { urlOrQuery } = req.body;
      if (!urlOrQuery || typeof urlOrQuery !== 'string') {
        return res.status(400).json({ error: 'urlOrQuery string is required' });
      }

      const ai = getGeminiClient();

      if (!ai) {
        return res.status(503).json({
          success: false,
          error: 'Product analysis is unavailable because GEMINI_API_KEY is not configured. No estimated or fabricated price was returned.'
        });
      }

      const prompt = `You are an expert Indian online e-commerce price analyzer and fake discount investigator.
Analyze the following product URL or query: "${urlOrQuery}".
Target Currency: Indian Rupees (INR, ₹).

Identify or estimate:
1. Product Title (accurate, concise)
2. Brand
3. Category (One of: 'Electronics', 'Gaming', 'Audio & Headphones', 'Home & Kitchen', 'Wearables', 'Fashion', 'Other')
4. Current Price (in Indian Rupees INR, e.g. 24999)
5. MSRP / List Price (in Indian Rupees INR)
6. Estimated 90-day Historical Low Price (in Indian Rupees INR)
7. Estimated Historical High Price (in Indian Rupees INR)
8. Main Retailer Store Name (e.g. Amazon India, Flipkart, Croma, Reliance Digital, Apple India, Vijay Sales, Tata CLiQ, Myntra, etc.)
9. Stock Status (boolean)
10. Fake Discount Risk ('low', 'moderate', or 'high'): Evaluates whether the MSRP was inflated to artificially inflate discount percentage.
11. Fake Discount Reason (Detailed explanation of MSRP integrity in Indian Rupee terms)
12. Buy Recommendation ('BUY_NOW', 'FAIR_DEAL', or 'WAIT')
13. Deal Score (integer from 0 to 100)
14. Key Specs / Features (array of up to 4 strings)
15. Comparison Store Prices (array of 2-3 other store prices in INR with storeName, price, inStock, url)
16. Executive Deal Summary (2 sentences max in Indian context)

Format response STRICTLY as valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              brand: { type: Type.STRING },
              category: {
                type: Type.STRING,
                enum: ['Electronics', 'Gaming', 'Audio & Headphones', 'Home & Kitchen', 'Wearables', 'Fashion', 'Other']
              },
              currentPrice: { type: Type.NUMBER },
              msrpPrice: { type: Type.NUMBER },
              estimatedHistoricalLow: { type: Type.NUMBER },
              estimatedHistoricalHigh: { type: Type.NUMBER },
              storeName: { type: Type.STRING },
              inStock: { type: Type.BOOLEAN },
              fakeDiscountRisk: { type: Type.STRING, enum: ['low', 'moderate', 'high'] },
              fakeDiscountReason: { type: Type.STRING },
              buyRecommendation: { type: Type.STRING, enum: ['BUY_NOW', 'FAIR_DEAL', 'WAIT'] },
              dealScore: { type: Type.INTEGER },
              keySpecs: { type: Type.ARRAY, items: { type: Type.STRING } },
              storePrices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    storeName: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    inStock: { type: Type.BOOLEAN },
                    url: { type: Type.STRING }
                  },
                  required: ['storeName', 'price', 'inStock']
                }
              },
              summary: { type: Type.STRING }
            },
            required: ['title', 'brand', 'category', 'currentPrice', 'msrpPrice', 'storeName', 'fakeDiscountRisk', 'buyRecommendation', 'dealScore']
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response from AI');
      }

      const parsedData = JSON.parse(text);
      return res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error('Error parsing product with Gemini:', err?.message || err);
      return res.status(502).json({
        success: false,
        error: 'Product analysis failed. No price estimate was generated; please retry later.'
      });
    }
  });

  // API 2: AI Bargain Assistant Advice
  app.post('/api/assistant/ask', async (req, res) => {
    try {
      const { question, currentProducts } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          success: true,
          answer: `I can help you analyze Indian online e-commerce deals in ₹ (Rupees)! Currently tracking ${currentProducts?.length || 0} items across Amazon India, Flipkart, Croma & Reliance Digital. For best deals, look for items marked with 'BUY_NOW' or 'Historic Low' tags.`
        });
      }

      const productsContext = currentProducts?.map((p: any) =>
        `- ${p.title} (${p.brand}): Current ₹${p.currentPrice?.toLocaleString('en-IN')}, MSRP ₹${p.msrpPrice?.toLocaleString('en-IN')}, Target ₹${p.targetPrice?.toLocaleString('en-IN')}, Deal Score ${p.dealScore}/100, Fake Discount Risk: ${p.fakeDiscountRisk}`
      ).join('\n') || 'No products currently in watchlist.';

      const prompt = `You are PricePulse AI, an expert Indian e-commerce shopping advisor and price analyst (specialized in Amazon India, Flipkart, Croma, Reliance Digital, Apple India, Vijay Sales, etc.).
All prices are strictly in Indian Rupees (INR, ₹).
The user is asking: "${question}"

Here is the user's current tracked products list:
${productsContext}

Provide a helpful, precise, clear 2-3 paragraph answer giving actionable shopping advice in Indian Rupees (₹), price trend analysis, and festive sale recommendations (Great Indian Festival, Big Billion Days, Diwali sales). If they ask whether to buy now or wait, give specific price thresholds in ₹.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      return res.json({
        success: true,
        answer: response.text || 'Unable to generate price advice right now.'
      });
    } catch (err: any) {
      console.error('Error in AI assistant endpoint:', err);
      return res.json({
        success: true,
        answer: 'PricePulse AI is temporarily offline. Please try asking again in a moment.'
      });
    }
  });

  // API 3: Live price refresh is intentionally disabled until a verified retailer
  // data provider is configured. Never fabricate price movements.
  app.post('/api/product/refresh-prices', (req, res) => {
    if (!Array.isArray(req.body?.products)) {
      return res.status(400).json({ success: false, error: 'products array is required' });
    }

    return res.status(501).json({
      success: false,
      refreshed: false,
      error: 'Live retailer price tracking is not configured yet. Existing prices were left unchanged.'
    });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'PricePulse Online Product Price Tracker (INR)' });
  });

  // Vite development middleware or production static server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PricePulse App running on http://0.0.0.0:${PORT}`);
  });
}

function generateMockParsedProduct(queryOrUrl: string) {
  const isHeadphones = queryOrUrl.toLowerCase().includes('headphone') || queryOrUrl.toLowerCase().includes('sony') || queryOrUrl.toLowerCase().includes('audio') || queryOrUrl.toLowerCase().includes('bose');
  const isApple = queryOrUrl.toLowerCase().includes('apple') || queryOrUrl.toLowerCase().includes('iphone') || queryOrUrl.toLowerCase().includes('macbook') || queryOrUrl.toLowerCase().includes('ipad');
  const isGaming = queryOrUrl.toLowerCase().includes('playstation') || queryOrUrl.toLowerCase().includes('ps5') || queryOrUrl.toLowerCase().includes('xbox') || queryOrUrl.toLowerCase().includes('game') || queryOrUrl.toLowerCase().includes('gpu');

  let title = queryOrUrl.startsWith('http')
    ? queryOrUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] + ' Product'
    : queryOrUrl;

  title = title.length > 5 ? title : 'Premium Electronics Product';

  if (isHeadphones) {
    return {
      title: 'Bose QuietComfort Ultra Wireless Noise-Cancelling Headphones',
      brand: 'Bose',
      category: 'Audio & Headphones',
      currentPrice: 32900,
      msrpPrice: 37900,
      estimatedHistoricalLow: 29900,
      estimatedHistoricalHigh: 37900,
      storeName: 'Amazon India',
      inStock: true,
      fakeDiscountRisk: 'low',
      fakeDiscountReason: 'Genuine ₹5,000 price drop verified against official Bose India MRP list.',
      buyRecommendation: 'BUY_NOW',
      dealScore: 86,
      keySpecs: ['Spatial Audio', '24-hour Battery', 'CustomTune Sound', 'USB-C Charging'],
      storePrices: [
        { storeName: 'Amazon India', price: 32900, inStock: true, url: 'https://www.amazon.in' },
        { storeName: 'Flipkart', price: 33900, inStock: true, url: 'https://www.flipkart.com' },
        { storeName: 'Croma', price: 35900, inStock: true, url: 'https://www.croma.com' }
      ],
      summary: 'Bose QC Ultra is currently at a 60-day low price of ₹32,900 on Amazon India.'
    };
  } else if (isApple) {
    return {
      title: 'Apple MacBook Air 13-inch (M3 Chip, 16GB RAM, 512GB SSD)',
      brand: 'Apple',
      category: 'Electronics',
      currentPrice: 114900,
      msrpPrice: 134900,
      estimatedHistoricalLow: 109900,
      estimatedHistoricalHigh: 134900,
      storeName: 'Flipkart',
      inStock: true,
      fakeDiscountRisk: 'low',
      fakeDiscountReason: 'Verified ₹20,000 discount from Apple official India MRP.',
      buyRecommendation: 'BUY_NOW',
      dealScore: 92,
      keySpecs: ['M3 8-core CPU', '18-hour Battery', '13.6-inch Liquid Retina Display', 'MagSafe 3'],
      storePrices: [
        { storeName: 'Flipkart', price: 114900, inStock: true, url: 'https://www.flipkart.com' },
        { storeName: 'Amazon India', price: 115900, inStock: true, url: 'https://www.amazon.in' },
        { storeName: 'Reliance Digital', price: 119900, inStock: true, url: 'https://www.reliancedigital.in' }
      ],
      summary: 'Excellent ₹20,000 savings on M3 MacBook Air in India. Highly recommended deal.'
    };
  } else if (isGaming) {
    return {
      title: 'ASUS ROG Ally X Handheld Gaming Console (512GB NVMe)',
      brand: 'ASUS',
      category: 'Gaming',
      currentPrice: 69990,
      msrpPrice: 79990,
      estimatedHistoricalLow: 64990,
      estimatedHistoricalHigh: 79990,
      storeName: 'Amazon India',
      inStock: true,
      fakeDiscountRisk: 'low',
      fakeDiscountReason: 'Genuine sale price drop on official handheld gaming console.',
      buyRecommendation: 'FAIR_DEAL',
      dealScore: 79,
      keySpecs: ['AMD Ryzen Z1 Extreme', '120Hz FHD Touchscreen', '80Wh Battery', '24GB LPDDR5X RAM'],
      storePrices: [
        { storeName: 'Amazon India', price: 69990, inStock: true, url: 'https://www.amazon.in' },
        { storeName: 'Flipkart', price: 71990, inStock: true, url: 'https://www.flipkart.com' }
      ],
      summary: 'Solid ₹10,000 price drop for ASUS ROG Ally X on Amazon India.'
    };
  }

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    brand: 'Generic / Brand',
    category: 'Electronics',
    currentPrice: 12990,
    msrpPrice: 16990,
    estimatedHistoricalLow: 10990,
    estimatedHistoricalHigh: 16990,
    storeName: 'Amazon India',
    inStock: true,
    fakeDiscountRisk: 'low',
    fakeDiscountReason: 'Standard market price observed across Indian online sellers.',
    buyRecommendation: 'FAIR_DEAL',
    dealScore: 75,
    keySpecs: ['High Durability', 'Premium Finish', '1 Year Official Warranty'],
    storePrices: [
      { storeName: 'Amazon India', price: 12990, inStock: true, url: 'https://www.amazon.in' },
      { storeName: 'Flipkart', price: 13490, inStock: true, url: 'https://www.flipkart.com' }
    ],
    summary: 'Parsed product details successfully. Current price reflects ₹4,000 discount off standard MRP.'
  };
}

startServer();
