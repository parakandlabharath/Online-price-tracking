import test from 'node:test';
import assert from 'node:assert/strict';
import { validateImportedProducts } from './productValidation';

const validProduct = {
  id: 'p-1', title: 'Sample phone', brand: 'Example', category: 'Electronics',
  imageUrl: '', url: 'https://example.com/item', currentPrice: 100, msrpPrice: 150,
  historicalLowPrice: 90, historicalHighPrice: 150, averagePrice: 120, currency: '₹',
  storeName: 'Example Store', inStock: true, targetPrice: 95, lastChecked: 'today',
  fakeDiscountRisk: 'low', dealScore: 80, buyRecommendation: 'FAIR_DEAL',
  priceHistory: [], storePrices: [], tags: [], priority: 'medium', isFavorite: false
};

test('accepts a valid exported product list', () => {
  assert.equal(validateImportedProducts([validProduct]).length, 1);
});

test('rejects non-array input and missing required fields', () => {
  assert.throws(() => validateImportedProducts({}), /JSON array/);
  assert.throws(() => validateImportedProducts([{ ...validProduct, title: '' }]), /title is required/);
});

test('rejects invalid prices, duplicate IDs and excessive deal scores', () => {
  assert.throws(() => validateImportedProducts([{ ...validProduct, currentPrice: -1 }]), /currentPrice/);
  assert.throws(() => validateImportedProducts([validProduct, validProduct]), /Duplicate product ID/);
  assert.throws(() => validateImportedProducts([{ ...validProduct, dealScore: 101 }]), /dealScore/);
});
