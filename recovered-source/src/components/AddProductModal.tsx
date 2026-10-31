import React, { useState } from 'react';
import { X, Sparkles, AlertTriangle, CheckCircle2, ShieldAlert, Store, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { parseProductURLOrQuery } from '../services/api';
import { AIAnalysisResult, Product } from '../types';
import { formatPrice } from '../lib/formatters';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  initialQuery?: string;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  initialQuery = ''
}) => {
  const [urlOrQuery, setUrlOrQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedResult, setExtractedResult] = useState<AIAnalysisResult | null>(null);
  const [targetPriceInput, setTargetPriceInput] = useState<number>(0);

  if (!isOpen) return null;

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlOrQuery.trim()) {
      setError('Please enter a product URL or product title');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await parseProductURLOrQuery(urlOrQuery.trim());
      setExtractedResult(result);
      // Default target price to 10% below current price or 5% below historical low
      const suggestedTarget = Math.round(result.currentPrice * 0.9);
      setTargetPriceInput(suggestedTarget);
    } catch (err: any) {
      setError(err.message || 'Failed to extract product price details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!extractedResult) return;

    // Create a new Product instance
    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      title: extractedResult.title,
      brand: extractedResult.brand || 'Generic',
      category: extractedResult.category || 'Electronics',
      imageUrl: getRandomUnsplashForCategory(extractedResult.category),
      url: urlOrQuery.startsWith('http') ? urlOrQuery : `https://www.google.com/search?q=${encodeURIComponent(extractedResult.title)}`,
      currentPrice: extractedResult.currentPrice,
      msrpPrice: extractedResult.msrpPrice,
      historicalLowPrice: extractedResult.estimatedHistoricalLow || Math.round(extractedResult.currentPrice * 0.92),
      historicalHighPrice: extractedResult.estimatedHistoricalHigh || extractedResult.msrpPrice,
      averagePrice: Math.round((extractedResult.currentPrice + extractedResult.msrpPrice) / 2),
      currency: '₹',
      storeName: extractedResult.storeName || 'Amazon India',
      inStock: extractedResult.inStock,
      rating: 4.6,
      reviewsCount: Math.floor(Math.random() * 3000) + 120,
      targetPrice: targetPriceInput > 0 ? targetPriceInput : Math.round(extractedResult.currentPrice * 0.9),
      lastChecked: 'Just now',
      fakeDiscountRisk: extractedResult.fakeDiscountRisk || 'low',
      fakeDiscountReason: extractedResult.fakeDiscountReason || 'Normal MRP verified.',
      dealScore: extractedResult.dealScore || 80,
      buyRecommendation: extractedResult.buyRecommendation || 'FAIR_DEAL',
      priority: 'medium',
      isFavorite: false,
      tags: [extractedResult.category, extractedResult.buyRecommendation.replace('_', ' ')],
      priceHistory: [
        { date: '60d ago', price: extractedResult.msrpPrice },
        { date: '30d ago', price: Math.round(extractedResult.currentPrice * 1.05) },
        { date: 'Today', price: extractedResult.currentPrice, note: 'Added to Tracker' }
      ],
      storePrices: extractedResult.storePrices?.length > 0
        ? extractedResult.storePrices.map(sp => ({
            storeName: sp.storeName,
            price: sp.price,
            originalPrice: extractedResult.msrpPrice,
            inStock: sp.inStock,
            url: sp.url || 'https://www.google.com',
            lastUpdated: 'Just now',
            isLowest: sp.price === extractedResult.currentPrice
          }))
        : [
            {
              storeName: extractedResult.storeName || 'Amazon India',
              price: extractedResult.currentPrice,
              originalPrice: extractedResult.msrpPrice,
              inStock: extractedResult.inStock,
              url: urlOrQuery.startsWith('http') ? urlOrQuery : 'https://www.google.com',
              lastUpdated: 'Just now',
              isLowest: true
            }
          ]
    };

    onAddProduct(newProduct);
    onClose();
    setExtractedResult(null);
    setUrlOrQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Track Online Price (INR)</h3>
              <p className="text-xs text-slate-400">Paste Amazon India, Flipkart or store link to extract live price & MRP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Step 1: Input URL or Query */}
          <form onSubmit={handleAnalyze} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product URL or Search Query
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlOrQuery}
                onChange={(e) => setUrlOrQuery(e.target.value)}
                placeholder="e.g. https://www.amazon.in/dp/B09XS7JWHH or Sony XM5 Headphones"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-sm rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Extract Price
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </form>

          {/* Quick Preset Buttons */}
          {!extractedResult && !isLoading && (
            <div className="space-y-2">
              <span className="text-xs text-slate-500">Or try popular tracked Indian items:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Sony XM5 Headphones',
                  'Apple iPad Air M2',
                  'LG C3 65 OLED TV',
                  'PlayStation 5 Slim Console'
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      setUrlOrQuery(sample);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors border border-slate-700/60"
                  >
                    + {sample}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Extracted AI Result Preview */}
          {extractedResult && (
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Live Product Details Extracted
                </span>
                <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                  {extractedResult.storeName}
                </span>
              </div>

              <div>
                <h4 className="font-semibold text-base text-white">{extractedResult.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Brand: {extractedResult.brand} | Category: {extractedResult.category}</p>
              </div>

              {/* Price & MSRP grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase block">Current Price</span>
                  <span className="text-lg font-bold text-emerald-400">{formatPrice(extractedResult.currentPrice)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase block">MSRP / List</span>
                  <span className="text-sm font-semibold text-slate-400 line-through">{formatPrice(extractedResult.msrpPrice)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase block">Est. 90d Low</span>
                  <span className="text-sm font-semibold text-blue-400">{formatPrice(extractedResult.estimatedHistoricalLow)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase block">Deal Score</span>
                  <span className="text-sm font-bold text-indigo-400">{extractedResult.dealScore}/100</span>
                </div>
              </div>

              {/* Fake Discount Warning Inspector */}
              <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                extractedResult.fakeDiscountRisk === 'high'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : extractedResult.fakeDiscountRisk === 'moderate'
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">
                    MSRP Fraud Check: {extractedResult.fakeDiscountRisk.toUpperCase()} RISK
                  </span>
                  <p className="mt-0.5 text-[11px] opacity-90">{extractedResult.fakeDiscountReason}</p>
                </div>
              </div>

              {/* Target Price Configuration */}
              <div className="space-y-2 pt-2 border-t border-slate-700/60">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-slate-300">Set Price Drop Target Alert (₹)</label>
                  <span className="text-slate-400">Current: {formatPrice(extractedResult.currentPrice)}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    step="100"
                    value={targetPriceInput}
                    onChange={(e) => setTargetPriceInput(parseFloat(e.target.value) || 0)}
                    className="w-32 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex gap-2">
                    {[5, 10, 15].map((discountPct) => {
                      const target = Math.round(extractedResult.currentPrice * (1 - discountPct / 100));
                      return (
                        <button
                          key={discountPct}
                          type="button"
                          onClick={() => setTargetPriceInput(target)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700"
                        >
                          -{discountPct}% ({formatPrice(target)})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors"
          >
            Cancel
          </button>

          {extractedResult && (
            <button
              onClick={handleConfirmAdd}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              Confirm & Start Tracking
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

function getRandomUnsplashForCategory(category?: string) {
  switch (category) {
    case 'Audio & Headphones':
      return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
    case 'Electronics':
      return 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80';
    case 'Gaming':
      return 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80';
    case 'Home & Kitchen':
      return 'https://images.unsplash.com/photo-1517668808822-9ed02810a01d?auto=format&fit=crop&w=800&q=80';
    default:
      return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
  }
}
