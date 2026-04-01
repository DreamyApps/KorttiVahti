import firebaseConfig from './firebase';
import { MOCK_PRODUCTS, getMockListings, getMockPriceHistory, MOCK_STORES } from '@/utils/mockData';
import type { Product, Listing, PriceHistoryEntry, Store, ProductCategory, SortOption } from '@/utils/types';

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
  nullValue?: null;
}

function extractValue(v: FirestoreValue): any {
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.timestampValue !== undefined) return new Date(v.timestampValue).getTime();
  if (v.arrayValue?.values) return v.arrayValue.values.map(extractValue);
  if (v.nullValue !== undefined) return null;
  return null;
}

function docToProduct(doc: any): Product {
  const f = doc.fields ?? {};
  const id = (doc.name as string).split('/').pop() ?? '';
  return {
    id,
    name: extractValue(f.name ?? {}) ?? '',
    nameFi: extractValue(f.nameFi ?? {}) ?? '',
    nameEn: extractValue(f.nameEn ?? {}) ?? '',
    category: extractValue(f.category ?? {}) ?? 'special',
    set: extractValue(f.set ?? {}) ?? '',
    imageUrl: extractValue(f.imageUrl ?? {}) ?? '',
    lowestPrice: extractValue(f.lowestPrice ?? {}) ?? 0,
    lowestPriceStore: extractValue(f.lowestPriceStore ?? {}) ?? '',
    highestPrice: extractValue(f.highestPrice ?? {}) ?? 0,
    storeCount: extractValue(f.storeCount ?? {}) ?? 0,
    inStockCount: extractValue(f.inStockCount ?? {}) ?? 0,
    lastUpdated: extractValue(f.lastUpdated ?? {}) ?? Date.now(),
    createdAt: extractValue(f.createdAt ?? {}) ?? Date.now(),
    tags: extractValue(f.tags ?? {}) ?? [],
  };
}

function docToListing(doc: any): Listing {
  const f = doc.fields ?? {};
  return {
    storeId: extractValue(f.storeId ?? {}) ?? '',
    storeName: extractValue(f.storeName ?? {}) ?? '',
    price: extractValue(f.price ?? {}) ?? 0,
    originalPrice: extractValue(f.originalPrice ?? {}) ?? undefined,
    inStock: extractValue(f.inStock ?? {}) ?? false,
    url: extractValue(f.url ?? {}) ?? '',
    lastSeen: extractValue(f.lastSeen ?? {}) ?? Date.now(),
    lastPriceChange: extractValue(f.lastPriceChange ?? {}) ?? Date.now(),
  };
}

function docToPriceHistory(doc: any): PriceHistoryEntry {
  const f = doc.fields ?? {};
  return {
    storeId: extractValue(f.storeId ?? {}) ?? '',
    price: extractValue(f.price ?? {}) ?? 0,
    inStock: extractValue(f.inStock ?? {}) ?? false,
    timestamp: extractValue(f.timestamp ?? {}) ?? Date.now(),
  };
}

async function firestoreGet(path: string): Promise<any> {
  const url = `${FIRESTORE_BASE}/${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Firestore GET ${path}: ${res.status}`);
  return res.json();
}

async function firestoreList(collection: string, pageSize = 300): Promise<any[]> {
  const url = `${FIRESTORE_BASE}/${collection}?pageSize=${pageSize}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Firestore LIST ${collection}: ${res.status}`);
  const data = await res.json();
  return data.documents ?? [];
}

export async function fetchProducts(
  category?: ProductCategory,
  sort?: SortOption,
  search?: string
): Promise<Product[]> {
  try {
    const docs = await firestoreList('products');
    if (docs.length === 0) throw new Error('No products in Firestore');

    let results = docs.map(docToProduct);

    if (category) {
      results = results.filter((p) => p.category === category);
    }

    if (search && search.trim().length > 0) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.set.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    switch (sort) {
      case 'price_asc':
        results.sort((a, b) => a.lowestPrice - b.lowestPrice);
        break;
      case 'price_desc':
        results.sort((a, b) => b.lowestPrice - a.lowestPrice);
        break;
      case 'newest':
        results.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        results.sort((a, b) => b.createdAt - a.createdAt);
    }

    return results;
  } catch {
    // Fallback to mock data if Firestore is empty or unreachable
    return fetchProductsMock(category, sort, search);
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const doc = await firestoreGet(`products/${id}`);
    if (!doc.fields) throw new Error('Not found');
    return docToProduct(doc);
  } catch {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
}

export async function fetchListings(productId: string): Promise<Listing[]> {
  try {
    const docs = await firestoreList(`products/${productId}/listings`);
    if (docs.length === 0) throw new Error('No listings');
    return docs.map(docToListing).sort((a, b) => a.price - b.price);
  } catch {
    return getMockListings(productId);
  }
}

export async function fetchPriceHistory(productId: string): Promise<PriceHistoryEntry[]> {
  try {
    const docs = await firestoreList(`products/${productId}/priceHistory`);
    if (docs.length === 0) throw new Error('No history');
    return docs.map(docToPriceHistory).sort((a, b) => a.timestamp - b.timestamp);
  } catch {
    return getMockPriceHistory(productId);
  }
}

export async function fetchStores(): Promise<Store[]> {
  try {
    const docs = await firestoreList('stores');
    if (docs.length === 0) throw new Error('No stores');
    return docs.map((doc) => {
      const f = doc.fields ?? {};
      return {
        id: extractValue(f.id ?? {}) ?? '',
        name: extractValue(f.name ?? {}) ?? '',
        url: extractValue(f.url ?? {}) ?? '',
        logoUrl: extractValue(f.logoUrl ?? {}) ?? '',
        scrapeEnabled: extractValue(f.scrapeEnabled ?? {}) ?? false,
        lastScrapeAt: extractValue(f.lastScrapeAt ?? {}) ?? 0,
        lastScrapeStatus: extractValue(f.lastScrapeStatus ?? {}) ?? 'error',
        productCount: extractValue(f.productCount ?? {}) ?? 0,
      } as Store;
    });
  } catch {
    return MOCK_STORES;
  }
}

function fetchProductsMock(
  category?: ProductCategory,
  sort?: SortOption,
  search?: string
): Product[] {
  let results = [...MOCK_PRODUCTS];
  if (category) results = results.filter((p) => p.category === category);
  if (search && search.trim().length > 0) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.set.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }
  switch (sort) {
    case 'price_asc': results.sort((a, b) => a.lowestPrice - b.lowestPrice); break;
    case 'price_desc': results.sort((a, b) => b.lowestPrice - a.lowestPrice); break;
    case 'newest': results.sort((a, b) => b.createdAt - a.createdAt); break;
    case 'name': results.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: results.sort((a, b) => b.createdAt - a.createdAt);
  }
  return results;
}
