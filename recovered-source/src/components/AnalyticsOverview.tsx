import React from 'react';
import { 
  TrendingDown, 
  IndianRupee, 
  Tag, 
  ShieldAlert, 
  Search, 
  Heart, 
  Sparkles, 
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../lib/formatters';

interface AnalyticsOverviewProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  filterPriceDrops: boolean;
  setFilterPriceDrops: (val: boolean) => void;
  filterMsrpWarning: boolean;
  setFilterMsrpWarning: (val: boolean) => void;
  filterFavorites: boolean;
  setFilterFavorites: (val: boolean) => void;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  filterPriceDrops,
  setFilterPriceDrops,
  filterMsrpWarning,
  setFilterMsrpWarning,
  filterFavorites,
  setFilterFavorites
}) => {
  // Compute analytics metrics
  const totalTracked = products.length;
  
  const priceDropsCount = products.filter(
    p => p.currentPrice < p.msrpPrice || p.currentPrice <= p.targetPrice
  ).length;

  const totalPotentialSavings = products.reduce((acc, p) => {
    const diff = p.msrpPrice - p.currentPrice;
    return acc + (diff > 0 ? diff : 0);
  }, 0);

  const msrpWarningsCount = products.filter(p => p.fakeDiscountRisk !== 'low').length;

  const categories = ['All', 'Audio & Headphones', 'Electronics', 'Gaming', 'Home & Kitchen', 'Wearables', 'Fashion'];

  return (
    <div className="space-y-6">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        
        {/* Metric 1 */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">{totalTracked}</span>
            <p className="text-xs text-slate-400 font-medium">Tracked Items</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">{priceDropsCount}</span>
            <p className="text-xs text-slate-400 font-medium">Active Price Drops</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">
              {formatPrice(totalPotentialSavings)}
            </span>
            <p className="text-xs text-slate-400 font-medium">Total Discount Savings</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">{msrpWarningsCount}</span>
            <p className="text-xs text-slate-400 font-medium">Inflated MSRP Flags</p>
          </div>
        </div>

      </div>

      {/* Control Toolbar: Category Chips, Search, Quick Filters & Sorting */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 space-y-4 shadow-sm">
        
        {/* Category Scroll Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter products or brand..."
              className="w-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-100 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500/80 placeholder:text-slate-500"
            />
          </div>

          {/* Quick Filter Toggles & Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto">
            
            {/* Price Drop Filter */}
            <button
              onClick={() => setFilterPriceDrops(!filterPriceDrops)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                filterPriceDrops
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              On Sale
            </button>

            {/* MSRP Warning Filter */}
            <button
              onClick={() => setFilterMsrpWarning(!filterMsrpWarning)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                filterMsrpWarning
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              MSRP Warnings
            </button>

            {/* Favorites Filter */}
            <button
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                filterFavorites
                  ? 'bg-rose-500/15 border-rose-500/50 text-rose-400'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Saved
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="biggest_drop" className="bg-slate-900 text-slate-200">Biggest Price Drop</option>
                <option value="lowest_price" className="bg-slate-900 text-slate-200">Lowest Price First</option>
                <option value="highest_savings" className="bg-slate-900 text-slate-200">Highest Savings (₹)</option>
                <option value="deal_score" className="bg-slate-900 text-slate-200">Best Deal Score</option>
              </select>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
