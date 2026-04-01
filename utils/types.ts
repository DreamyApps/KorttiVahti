export type ProductCategory =
  | 'booster_box'
  | 'etb'
  | 'tin'
  | 'collection'
  | 'blister'
  | 'bundle'
  | 'special';

export interface Product {
  id: string;
  name: string;
  nameFi: string;
  nameEn: string;
  category: ProductCategory;
  set: string;
  imageUrl: string;
  lowestPrice: number;
  lowestPriceStore: string;
  highestPrice: number;
  storeCount: number;
  inStockCount: number;
  lastUpdated: number;
  createdAt: number;
  tags: string[];
}

export interface Listing {
  storeId: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  url: string;
  lastSeen: number;
  lastPriceChange: number;
}

export interface PriceHistoryEntry {
  storeId: string;
  price: number;
  inStock: boolean;
  timestamp: number;
}

export interface Store {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  scrapeEnabled: boolean;
  lastScrapeAt: number;
  lastScrapeStatus: 'success' | 'error';
  productCount: number;
}

export interface PriceAlert {
  productId: string;
  targetPrice: number;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  fcmTokens: string[];
  favorites: string[];
  priceAlerts: PriceAlert[];
  language: 'fi' | 'en';
  notificationPrefs: {
    priceDrops: boolean;
    newProducts: boolean;
    backInStock: boolean;
    dailyDeals: boolean;
  };
}

export interface ScrapedProduct {
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  url: string;
  imageUrl?: string;
  category?: string;
}

export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'name';
export type ViewMode = 'grid' | 'list';
export type PriceRange = '7d' | '30d' | '90d' | 'all';
