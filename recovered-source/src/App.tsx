import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  Sparkles, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Bell,
  Search,
  Zap,
  BarChart2,
  SlidersHorizontal
} from 'lucide-react';
import { Product, NotificationItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_NOTIFICATIONS } from './data/initialProducts';
import { Header } from './components/Header';
import { AnalyticsOverview } from './components/AnalyticsOverview';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AddProductModal } from './components/AddProductModal';
import { PriceAlertsDrawer } from './components/PriceAlertsDrawer';
import { AIBargainAssistantModal } from './components/AIBargainAssistantModal';
import { ExportImportModal } from './components/ExportImportModal';
import { refreshProductPrices, parseProductURLOrQuery } from './services/api';
import { formatPrice } from './lib/formatters';

export default function App() {
  // Load products from LocalStorage or fall back to INITIAL_PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('pricepulse_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PRODUCTS;
  });

  // Load notifications from LocalStorage
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('pricepulse_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  // Filters & Sorting State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('biggest_drop');
  const [filterPriceDrops, setFilterPriceDrops] = useState<boolean>(false);
  const [filterMsrpWarning, setFilterMsrpWarning] = useState<boolean>(false);
  const [filterFavorites, setFilterFavorites] = useState<boolean>(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights'>('dashboard');

  // Modals & Drawers state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  
  const [quickUrlInput, setQuickUrlInput] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('pricepulse_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('pricepulse_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Add Product
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Added "${newProduct.title.substring(0, 30)}..." to price tracker!`);

    // If price is already below target, trigger notification
    if (newProduct.currentPrice <= newProduct.targetPrice) {
      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        productId: newProduct.id,
        productTitle: newProduct.title,
        productImage: newProduct.imageUrl,
        oldPrice: newProduct.msrpPrice,
        newPrice: newProduct.currentPrice,
        store: newProduct.storeName,
        timestamp: 'Just now',
        read: false,
        type: 'target_reached',
        message: `🎯 Target Price Reached! Currently ${formatPrice(newProduct.currentPrice)} on ${newProduct.storeName}.`
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed from tracker.');
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  // Update Target Price
  const handleUpdateTargetPrice = (id: string, newTarget: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, targetPrice: newTarget } : p));
    showToast('Target price alert threshold updated.');
  };

  // Refresh Live Prices across stores
  const handleRefreshPrices = async () => {
    setIsRefreshing(true);
    try {
      const updated = await refreshProductPrices(products);
      setProducts(updated);
      showToast('Live price refresh is unavailable: no verified retailer data provider is configured.');
    } catch (err) {
      showToast('Failed to refresh prices. Using existing data.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Quick Analyze from Header Input
  const handleQuickAnalyze = (url: string) => {
    setQuickUrlInput(url);
    setIsAddModalOpen(true);
  };

  // Demo-only action: never alter tracked prices or create fake alerts.
  const handleSimulatePriceDrop = () => {
    showToast('Demo only: simulated price changes are disabled to protect price accuracy.');
  };

  // Notification Drawer Handlers
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
  };

  const handleSelectProductFromNotif = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setSelectedDetailProduct(prod);
      setIsAlertsOpen(false);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    // Category match
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchStore = p.storeName.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchStore) return false;
    }
    // Price drops toggle
    if (filterPriceDrops && p.currentPrice >= p.msrpPrice && p.currentPrice > p.targetPrice) {
      return false;
    }
    // MSRP warning toggle
    if (filterMsrpWarning && p.fakeDiscountRisk === 'low') {
      return false;
    }
    // Favorites toggle
    if (filterFavorites && !p.isFavorite) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'biggest_drop') {
      const dropA = a.msrpPrice - a.currentPrice;
      const dropB = b.msrpPrice - b.currentPrice;
      return dropB - dropA;
    } else if (sortBy === 'lowest_price') {
      return a.currentPrice - b.currentPrice;
    } else if (sortBy === 'highest_savings') {
      return (b.msrpPrice - b.currentPrice) - (a.msrpPrice - a.currentPrice);
    } else if (sortBy === 'deal_score') {
      return b.dealScore - a.dealScore;
    }
    return 0;
  });

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast Notification Popup */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header Bar */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
        onRefreshPrices={handleRefreshPrices}
        isRefreshing={isRefreshing}
        unreadCount={unreadNotifsCount}
        quickUrlInput={quickUrlInput}
        setQuickUrlInput={setQuickUrlInput}
        onQuickAnalyze={handleQuickAnalyze}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {activeTab === 'dashboard' ? (
          <>
            {/* Overview Stats & Filter Toolbar */}
            <AnalyticsOverview
              products={products}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterPriceDrops={filterPriceDrops}
              setFilterPriceDrops={setFilterPriceDrops}
              filterMsrpWarning={filterMsrpWarning}
              setFilterMsrpWarning={setFilterMsrpWarning}
              filterFavorites={filterFavorites}
              setFilterFavorites={setFilterFavorites}
            />

            {/* Product Cards Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-400" />
                  Tracked Products
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {filteredProducts.length} items
                  </span>
                </h2>

                <button
                  onClick={handleSimulatePriceDrop}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Simulate Price Fluctuation
                </button>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4 text-slate-400">
                  <TrendingDown className="w-12 h-12 mx-auto text-slate-600" />
                  <div>
                    <h3 className="font-semibold text-lg text-white">No products found</h3>
                    <p className="text-xs text-slate-500 mt-1">Try resetting your search query or filters, or track a new product.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setFilterPriceDrops(false);
                      setFilterMsrpWarning(false);
                      setFilterFavorites(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetail={(prod) => setSelectedDetailProduct(prod)}
                      onToggleFavorite={handleToggleFavorite}
                      onDeleteProduct={handleDeleteProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* AI Deal Assistant View */
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">AI Deal & Price Trend Assistant</h2>
                  <p className="text-xs text-slate-400">Ask the AI assistant for general shopping guidance. AI-generated prices and historical estimates are not verified retailer quotes.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => setIsAssistantOpen(true)}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Launch Full AI Assistant Chat
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-900/60 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs">
              P
            </div>
            <span className="font-semibold text-slate-300">PricePulse India - Online Product Price Tracker (₹)</span>
          </div>
          <p>© 2026 PricePulse AI. Demo workspace. Live retailer price verification is not configured.</p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
        initialQuery={quickUrlInput}
      />

      <ProductDetailModal
        product={selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onUpdateTargetPrice={handleUpdateTargetPrice}
      />

      <PriceAlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onClearAll={handleClearAllNotifs}
        onSelectProduct={handleSelectProductFromNotif}
        onSimulatePriceDrop={handleSimulatePriceDrop}
      />

      <AIBargainAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        products={products}
      />

      <ExportImportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        products={products}
        onImportProducts={(imported) => {
          setProducts(imported);
          showToast(`Imported ${imported.length} products successfully!`);
        }}
        onResetToDefault={() => {
          // Clear localStorage so user gets fresh INR dataset
          localStorage.removeItem('pricepulse_products');
          localStorage.removeItem('pricepulse_notifications');
          setProducts(INITIAL_PRODUCTS);
          setNotifications(INITIAL_NOTIFICATIONS);
          showToast('Reset to initial Indian Rupee demo products.');
        }}
      />

    </div>
  );
}
