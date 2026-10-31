export interface PricePoint {
  date: string;
  price: number;
  store?: string;
  note?: string;
}

export interface StorePrice {
  storeName: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  url: string;
  lastUpdated: string;
  isLowest?: boolean;
}

export type FakeDiscountRisk = 'low' | 'moderate' | 'high';
export type BuyRecommendation = 'BUY_NOW' | 'FAIR_DEAL' | 'WAIT';

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: 'Electronics' | 'Gaming' | 'Audio & Headphones' | 'Home & Kitchen' | 'Wearables' | 'Fashion' | 'Other';
  imageUrl: string;
  url: string;
  currentPrice: number;
  msrpPrice: number;
  historicalLowPrice: number;
  historicalHighPrice: number;
  averagePrice: number;
  currency: string;
  storeName: string;
  inStock: boolean;
  rating?: number;
  reviewsCount?: number;
  targetPrice: number;
  lastChecked: string;
  fakeDiscountRisk: FakeDiscountRisk;
  fakeDiscountReason?: string;
  dealScore: number; // 0 to 100
  buyRecommendation: BuyRecommendation;
  priceHistory: PricePoint[];
  storePrices: StorePrice[];
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  isFavorite?: boolean;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productTitle: string;
  targetPrice: number;
  triggerType: 'below_target' | 'price_drop' | 'back_in_stock';
  active: boolean;
  createdDate: string;
  lastTriggeredDate?: string;
}

export interface NotificationItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  oldPrice: number;
  newPrice: number;
  store: string;
  timestamp: string;
  read: boolean;
  type: 'price_drop' | 'target_reached' | 'fake_discount_warning';
  message: string;
}

export interface AIAnalysisResult {
  title: string;
  brand: string;
  category: Product['category'];
  currentPrice: number;
  msrpPrice: number;
  estimatedHistoricalLow: number;
  estimatedHistoricalHigh: number;
  storeName: string;
  inStock: boolean;
  fakeDiscountRisk: FakeDiscountRisk;
  fakeDiscountReason: string;
  buyRecommendation: BuyRecommendation;
  dealScore: number;
  keySpecs: string[];
  storePrices: { storeName: string; price: number; inStock: boolean; url: string }[];
  summary: string;
}
