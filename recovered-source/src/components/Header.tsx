import React, { useState } from 'react';
import { 
  TrendingDown, 
  Search, 
  Bell, 
  Sparkles, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  Download, 
  BarChart3 
} from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenAssistant: () => void;
  onOpenAlerts: () => void;
  onOpenExportModal: () => void;
  onRefreshPrices: () => void;
  isRefreshing: boolean;
  unreadCount: number;
  quickUrlInput: string;
  setQuickUrlInput: (val: string) => void;
  onQuickAnalyze: (url: string) => void;
  activeTab: 'dashboard' | 'insights';
  setActiveTab: (tab: 'dashboard' | 'insights') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenAssistant,
  onOpenAlerts,
  onOpenExportModal,
  onRefreshPrices,
  isRefreshing,
  unreadCount,
  quickUrlInput,
  setQuickUrlInput,
  onQuickAnalyze,
  activeTab,
  setActiveTab
}) => {
  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickUrlInput.trim()) {
      onQuickAnalyze(quickUrlInput.trim());
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingDown className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">PricePulse</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  MSRP Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">Real E-Commerce Price Tracker & Fraud Inspector</p>
            </div>
          </div>

          {/* Quick Paste Bar */}
          <form onSubmit={handleQuickSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={quickUrlInput}
                onChange={(e) => setQuickUrlInput(e.target.value)}
                placeholder="Paste Amazon, BestBuy, Walmart URL or search product..."
                className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800 text-sm text-slate-100 pl-10 pr-24 py-2 rounded-xl border border-slate-700/80 focus:outline-none focus:border-emerald-500/80 transition-all placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                <Sparkles className="w-3 h-3" />
                Track
              </button>
            </div>
          </form>

          {/* Navigation Tabs */}
          <div className="hidden lg:flex items-center bg-slate-800/60 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Tracker
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'insights'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              AI Deal Assistant
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Refresh Prices Button */}
            <button
              onClick={onRefreshPrices}
              disabled={isRefreshing}
              title="Re-check live prices across online stores"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAssistant}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Ask AI
            </button>

            {/* Alert Drawer Toggle */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="Price Alert Center"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Export / Backup */}
            <button
              onClick={onOpenExportModal}
              title="Export / Backup Tracker Data"
              className="hidden sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Add Product Button */}
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden xs:inline">Track Product</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
