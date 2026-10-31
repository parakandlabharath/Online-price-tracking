import React from 'react';
import { 
  TrendingDown, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  BellRing, 
  Heart, 
  Trash2, 
  Store, 
  BarChart2, 
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../lib/formatters';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteProduct: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onToggleFavorite,
  onDeleteProduct
}) => {
  const discountAmount = product.msrpPrice - product.currentPrice;
  const discountPercentage = product.msrpPrice > 0
    ? Math.round((discountAmount / product.msrpPrice) * 100)
    : 0;

  const isBelowTarget = product.currentPrice <= product.targetPrice;
  const isHistoricalLow = product.currentPrice <= product.historicalLowPrice;

  return (
    <div className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-between">
      
      {/* Top Banner & Image Container */}
      <div>
        <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {/* Store Tag */}
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center gap-1 shadow-sm">
              <Store className="w-3 h-3 text-emerald-400" />
              {product.storeName}
            </span>

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20">
                -{discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Top Right Action (Favorite Button) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-rose-400 transition-colors z-10"
            title="Save to Favorites"
          >
            <Heart className={`w-4 h-4 ${product.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Historical Low Banner Overlay */}
          {isHistoricalLow && (
            <div className="absolute bottom-3 left-3 right-3 px-3 py-1 rounded-xl bg-emerald-500/90 backdrop-blur-md text-slate-950 font-bold text-xs flex items-center justify-between shadow-lg">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                HISTORICAL ALL-TIME LOW
              </span>
              <span>{formatPrice(product.historicalLowPrice, product.currency)}</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          
          {/* Brand & Title */}
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">{product.brand}</span>
            <h3 
              onClick={() => onOpenDetail(product)}
              className="font-semibold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-2 cursor-pointer mt-0.5"
            >
              {product.title}
            </h3>
          </div>

          {/* Price Matrix */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-emerald-400 tracking-tight">
                {formatPrice(product.currentPrice, product.currency)}
              </span>
              {discountAmount > 0 && (
                <span className="ml-2 text-xs font-semibold text-slate-400 line-through">
                  {formatPrice(product.msrpPrice, product.currency)}
                </span>
              )}
            </div>

            {discountAmount > 0 && (
              <span className="text-xs font-medium text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Save {formatPrice(discountAmount, product.currency)}
              </span>
            )}
          </div>

          {/* Badges: Buy Recommendation & MSRP Integrity */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            
            {/* Recommendation */}
            <div className={`p-2 rounded-xl border flex items-center justify-between ${
              product.buyRecommendation === 'BUY_NOW'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : product.buyRecommendation === 'FAIR_DEAL'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <span className="font-semibold text-[11px]">
                {product.buyRecommendation === 'BUY_NOW' ? '🔥 BUY NOW' : product.buyRecommendation === 'FAIR_DEAL' ? '👍 FAIR DEAL' : '⏳ WAIT'}
              </span>
              <span className="text-[10px] opacity-80">{product.dealScore}/100</span>
            </div>

            {/* MSRP Fraud Detector Tag */}
            <div className={`p-2 rounded-xl border flex items-center gap-1.5 truncate ${
              product.fakeDiscountRisk === 'high'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : product.fakeDiscountRisk === 'moderate'
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`} title={product.fakeDiscountReason}>
              {product.fakeDiscountRisk === 'low' ? (
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="text-[10px] font-semibold truncate">
                {product.fakeDiscountRisk === 'low' ? 'MSRP Real' : 'Inflated MSRP'}
              </span>
            </div>

          </div>

          {/* Target Price Status */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <BellRing className={`w-3.5 h-3.5 ${isBelowTarget ? 'text-emerald-400 animate-bounce' : 'text-slate-500'}`} />
                Target Price:
              </span>
              <span className={`font-semibold ${isBelowTarget ? 'text-emerald-400' : 'text-slate-300'}`}>
                {formatPrice(product.targetPrice, product.currency)}
              </span>
            </div>

            {/* Progress bar towards target */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBelowTarget ? 'bg-emerald-400' : 'bg-slate-600'
                }`}
                style={{
                  width: `${Math.min(100, (product.targetPrice / product.currentPrice) * 100)}%`
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetail(product)}
          className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-colors border border-slate-700/60 flex items-center justify-center gap-1.5"
        >
          <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
          Price Chart & Analysis
        </button>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center shrink-0"
          title={`Visit ${product.storeName}`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>

        <button
          onClick={() => onDeleteProduct(product.id)}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-red-500/20 text-slate-500 hover:text-red-400 border border-slate-800 transition-colors shrink-0"
          title="Remove from tracker"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
