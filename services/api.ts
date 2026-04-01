// Firestore API layer.
// Currently uses mock data. Switch to Firestore when Firebase is configured.

import { MOCK_PRODUCTS, getMockListings, getMockPriceHistory, MOCK_STORES } from '@/utils/mockData';
import type { Product, Listing, PriceHistoryEntry, Store, ProductCategory, SortOption } from '@/utils/types';

export async function fetchProducts(
  category?: ProductCategory,
  sort?: SortOption,
  search?: string
): Promise<Product[]> {
  let results = [...MOCK_PRODUCTS];

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
  }

  return results;
}

export async function fetchProduct(id: string): Promise<Product | null> {
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function fetchListings(productId: string): Promise<Listing[]> {
  return getMockListings(productId);
}

export async function fetchPriceHistory(productId: string): Promise<PriceHistoryEntry[]> {
  return getMockPriceHistory(productId);
}

export async function fetchStores(): Promise<Store[]> {
  return MOCK_STORES;
}
