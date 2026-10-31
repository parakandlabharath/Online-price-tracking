import React, { useState } from 'react';
import { 
  X, 
  TrendingDown, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  Bell, 
  Store, 
  Sparkles, 
  Check, 
  IndianRupee
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  CartesianGrid 
} from 'recharts';
import { Product } from '../types';
import { formatPrice } from '../lib/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onUpdateTargetPrice: (id: string, newTarget: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onUpdateTargetPrice
}) => {
  if (!product) return null;

  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | 'ALL'>('ALL');
  const [targetInput, setTargetInput] = useState<number>(product.targetPrice);
  const [isSaved, setIsSaved] = useState(false);

  // Filter price history points based on selected timeframe
  const priceHistoryData = product.priceHistory || [];

  const handleSaveTarget = () => {
    onUpdateTargetPrice(product.id, targetInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const discountAmount = product.msrpPrice - product.currentPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">{product.brand}</span>
              <h3 className="font-semibold text-base text-white line-clamp-1">{product.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Current Price</span>
              <span className="text-2xl font-bold text-emerald-400">{formatPrice(product.currentPrice, product.currency)}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">MSRP List Price</span>
              <span className="text-lg font-semibold text-slate-400 line-through">{formatPrice(product.msrpPrice, product.currency)}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Historical All-Time Low</span>
              <span className="text-lg font-bold text-blue-400">{formatPrice(product.historicalLowPrice, product.currency)}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Deal Score</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-indigo-400">{product.dealScore}/100</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                  {product.buyRecommendation.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Price History Chart Section */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  Price Trend History (₹)
                </h4>
                <p className="text-xs text-slate-400">Historical price tracking with target price reference line</p>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['1M', '3M', '6M', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      timeframe === tf
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceHistoryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Price']}
                  />
                  
                  {/* Reference Line for Target Price */}
                  <ReferenceLine
                    y={product.targetPrice}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{ value: `Target ₹${product.targetPrice.toLocaleString('en-IN')}`, fill: '#ef4444', fontSize: 10, position: 'right' }}
                  />

                  {/* Reference Line for Historical Low */}
                  <ReferenceLine
                    y={product.historicalLowPrice}
                    stroke="#3b82f6"
                    strokeDasharray="3 3"
                    label={{ value: `Low ₹${product.historicalLowPrice.toLocaleString('en-IN')}`, fill: '#3b82f6', fontSize: 10, position: 'left' }}
                  />

                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#priceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MSRP Fraud & Fake Discount Inspector */}
          <div className={`p-4 rounded-2xl border space-y-2 ${
            product.fakeDiscountRisk === 'high'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : product.fakeDiscountRisk === 'moderate'
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              {product.fakeDiscountRisk === 'low' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <h4 className="font-semibold text-sm text-white">
                MSRP Integrity Inspection: {product.fakeDiscountRisk.toUpperCase()} FAKE DISCOUNT RISK
              </h4>
            </div>
            <p className="text-xs opacity-90 leading-relaxed pl-7">
              {product.fakeDiscountReason}
            </p>
          </div>

          {/* Multi-Store Comparison Matrix */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              Live Retailer Price Comparison (India)
            </h4>

            <div className="bg-slate-950/60 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="divide-y divide-slate-800">
                {product.storePrices?.map((sp, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-900/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                        {sp.storeName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-white block">{sp.storeName}</span>
                        <span className="text-[10px] text-slate-400">Checked {sp.lastUpdated || 'Recently'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-bold text-sm text-emerald-400 block">{formatPrice(sp.price, product.currency)}</span>
                        {sp.isLowest && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
                            Lowest Price
                          </span>
                        )}
                      </div>

                      <a
                        href={sp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1"
                      >
                        Visit Store
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Target Price Configuration */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                Target Price Alert Threshold (₹)
              </h4>
              <span className="text-xs text-slate-400">Receive instant alert when price falls below threshold</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  step="100"
                  value={targetInput}
                  onChange={(e) => setTargetInput(parseFloat(e.target.value) || 0)}
                  className="w-40 bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleSaveTarget}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Target Saved!
                  </>
                ) : (
                  'Update Target Alert'
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors"
          >
            Close
          </button>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            Buy Now on {product.storeName} ({formatPrice(product.currentPrice, product.currency)})
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
