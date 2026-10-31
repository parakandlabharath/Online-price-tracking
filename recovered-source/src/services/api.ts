import { AIAnalysisResult, Product } from '../types';

export async function parseProductURLOrQuery(urlOrQuery: string): Promise<AIAnalysisResult> {
  const response = await fetch('/api/product/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urlOrQuery })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze product link or search query.');
  }

  const json = await response.json();
  if (!json.success || !json.data) {
    throw new Error(json.error || 'Invalid product parsing result');
  }

  return json.data;
}

export async function askAIBargainAssistant(question: string, currentProducts: Product[]): Promise<string> {
  const response = await fetch('/api/assistant/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, currentProducts })
  });

  if (!response.ok) {
    return 'Unable to reach AI assistant service right now.';
  }

  const json = await response.json();
  return json.answer || 'No response from assistant.';
}

export async function refreshProductPrices(products: Product[]): Promise<Product[]> {
  const response = await fetch('/api/product/refresh-prices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products })
  });

  if (!response.ok) {
    throw new Error('Failed to refresh live product prices');
  }

  const json = await response.json();
  return json.products;
}
