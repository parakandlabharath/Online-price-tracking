import type { Product } from '../types';

const CATEGORIES = ['Electronics', 'Gaming', 'Audio & Headphones', 'Home & Kitchen', 'Wearables', 'Fashion', 'Other'];
const RISKS = ['low', 'moderate', 'high'];
const RECOMMENDATIONS = ['BUY_NOW', 'FAIR_DEAL', 'WAIT'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/** Validate imported backup data before it replaces the current watchlist. */
export function validateImportedProducts(value: unknown): Product[] {
  if (!Array.isArray(value)) throw new Error('Import must be a JSON array.');
  if (value.length > 500) throw new Error('A maximum of 500 products can be imported at once.');

  const ids = new Set<string>();
  return value.map((item, index) => {
    if (!isRecord(item)) throw new Error(`Product ${index + 1} must be an object.`);
    const requiredStrings = ['id', 'title', 'brand', 'url', 'storeName', 'currency'];
    for (const key of requiredStrings) {
      if (!isNonEmptyString(item[key])) throw new Error(`Product ${index + 1}: ${key} is required.`);
    }
    if (ids.has(item.id as string)) throw new Error(`Duplicate product ID: ${item.id}`);
    ids.add(item.id as string);

    for (const key of ['currentPrice', 'msrpPrice', 'historicalLowPrice', 'historicalHighPrice', 'averagePrice', 'targetPrice', 'dealScore']) {
      if (!isNonNegativeNumber(item[key])) throw new Error(`Product ${index + 1}: ${key} must be a non-negative number.`);
    }
    if ((item.dealScore as number) > 100) throw new Error(`Product ${index + 1}: dealScore must be between 0 and 100.`);
    if (!CATEGORIES.includes(String(item.category))) throw new Error(`Product ${index + 1}: unsupported category.`);
    if (!RISKS.includes(String(item.fakeDiscountRisk))) throw new Error(`Product ${index + 1}: invalid fakeDiscountRisk.`);
    if (!RECOMMENDATIONS.includes(String(item.buyRecommendation))) throw new Error(`Product ${index + 1}: invalid buyRecommendation.`);
    if (!Array.isArray(item.priceHistory) || !Array.isArray(item.storePrices) || !Array.isArray(item.tags)) {
      throw new Error(`Product ${index + 1}: priceHistory, storePrices and tags must be arrays.`);
    }
    return item as unknown as Product;
  });
}
