import test from 'node:test';
import assert from 'node:assert/strict';
import { validateImportedProducts } from './productValidation';

const validProduct = {
  id: 'p-1', title: 'Sample phone', brand: 'Example', category: 'Electronics',
  imageUrl: '', url: 'https://example.com/item', currentPrice: 100, msrpPrice: 150,
  historicalLowPrice: 90, historicalHighPrice: 150, averagePrice: 120, currency: '₹',
  storeName: 'Example Store', inStock: true, targetPrice: 95, lastChecked: new Date().toISOString(),
  fakeDiscountRisk: 'low', dealScore: 80, buyRecommendation: 'FAIR_DEAL',
  priceHistory: [{ date: 'May 12', price: 100 }],
  storePrices: [{ storeName: 'Example Store', price: 100, inStock: true, url: 'https://example.com/item', lastUpdated: new Date().toISOString() }],
  tags: ['phone'], priority: 'medium', isFavorite: false
};

test('accepts a valid exported product list', () => {
  assert.equal(validateImportedProducts([validProduct]).length, 1);
});

test('rejects non-array input and missing required fields', () => {
  assert.throws(() => validateImportedProducts({}), /JSON array/);
  assert.throws(() => validateImportedProducts([{ ...validProduct, title: '' }]), /required text field/);
});

test('rejects invalid prices, duplicate IDs and excessive deal scores', () => {
  assert.throws(() => validateImportedProducts([{ ...validProduct, currentPrice: -1 }]), /price or image field/);
  assert.throws(() => validateImportedProducts([validProduct, validProduct]), /Duplicate product ID/);
  assert.throws(() => validateImportedProducts([{ ...validProduct, dealScore: 101 }]), /dealScore/);
});

test('rejects unsafe URLs and malformed nested price observations', () => {
  assert.throws(() => validateImportedProducts([{ ...validProduct, url: 'javascript:alert(1)' }]), /product URL/);
  assert.throws(() => validateImportedProducts([{ ...validProduct, priceHistory: [{ date: '', price: 100 }] }]), /priceHistory/);
  assert.throws(() => validateImportedProducts([{ ...validProduct, storePrices: [{ storeName: 'Store', price: 20, inStock: true, url: 'file:///tmp/x', lastUpdated: 'now' }] }]), /storePrices/);
});
