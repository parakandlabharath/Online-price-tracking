import type { Product } from '../types';

const CATEGORIES = ['Electronics', 'Gaming', 'Audio & Headphones', 'Home & Kitchen', 'Wearables', 'Fashion', 'Other'];
const RISKS = ['low', 'moderate', 'high'];
const RECOMMENDATIONS = ['BUY_NOW', 'FAIR_DEAL', 'WAIT'];
const PRIORITIES = ['low', 'medium', 'high'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
function isOptionalText(value: unknown): boolean {
  return value === undefined || typeof value === 'string';
}
function isPrice(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}
function isHttpUrl(value: unknown): value is string {
  if (!isText(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Validate imported backup data before it replaces the current watchlist. */
export function validateImportedProducts(value: unknown): Product[] {
  if (!Array.isArray(value)) throw new Error('Import must be a JSON array.');
  if (value.length > 500) throw new Error('A maximum of 500 products can be imported at once.');

  const ids = new Set<string>();
  return value.map((item, index) => {
    const fail = (field: string): never => { throw new Error(`Product ${index + 1}: invalid ${field}.`); };
    if (!isRecord(item)) return fail('record');
    if (!isText(item.id) || !isText(item.title) || !isText(item.brand) ||
        !isText(item.storeName) || !isText(item.currency)) return fail('required text field');
    if (ids.has(item.id)) throw new Error(`Duplicate product ID: ${item.id}`);
    ids.add(item.id);

    if (!isHttpUrl(item.url)) return fail('product URL (HTTP or HTTPS required)');
    if (!isOptionalText(item.imageUrl) || !isPrice(item.currentPrice) || !isPrice(item.msrpPrice) ||
        !isPrice(item.historicalLowPrice) || !isPrice(item.historicalHighPrice) ||
        !isPrice(item.averagePrice) || !isPrice(item.targetPrice) || !isPrice(item.dealScore)) return fail('price or image field');
    if (item.dealScore > 100) return fail('dealScore (0–100)');
    if (!CATEGORIES.includes(String(item.category))) return fail('category');
    if (!RISKS.includes(String(item.fakeDiscountRisk))) return fail('fakeDiscountRisk');
    if (!RECOMMENDATIONS.includes(String(item.buyRecommendation))) return fail('buyRecommendation');
    if (!PRIORITIES.includes(String(item.priority))) return fail('priority');
    if (typeof item.inStock !== 'boolean' || typeof item.isFavorite !== 'undefined' && typeof item.isFavorite !== 'boolean') return fail('stock/favourite flag');
    if (!isText(item.lastChecked)) return fail('lastChecked');
    if (!Array.isArray(item.priceHistory) || !Array.isArray(item.storePrices) || !Array.isArray(item.tags)) return fail('history/store/tags arrays');
    if (!item.tags.every((tag) => typeof tag === 'string' && tag.length <= 60)) return fail('tags');
    if (!item.priceHistory.every((point) => isRecord(point) && isText(point.date) && isPrice(point.price))) return fail('priceHistory');
    if (!item.storePrices.every((store) => isRecord(store) && isText(store.storeName) && isPrice(store.price) &&
        typeof store.inStock === 'boolean' && isHttpUrl(store.url) && isText(store.lastUpdated) &&
        (store.originalPrice === undefined || isPrice(store.originalPrice)))) return fail('storePrices');
    return item as unknown as Product;
  });
}
