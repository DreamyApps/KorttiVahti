import { useQuery } from '@tanstack/react-query';
import { MOCK_PRODUCTS, getMockListings, getMockPriceHistory } from '@/utils/mockData';
import type { Product, ProductCategory, SortOption } from '@/utils/types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useProducts(category?: ProductCategory, sort?: SortOption, search?: string) {
  return useQuery({
    queryKey: ['products', category, sort, search],
    queryFn: async () => {
      await delay(300);
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
        default:
          results.sort((a, b) => b.createdAt - a.createdAt);
      }

      return results;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      await delay(200);
      return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
    },
  });
}

export function useProductListings(productId: string) {
  return useQuery({
    queryKey: ['listings', productId],
    queryFn: async () => {
      await delay(250);
      return getMockListings(productId);
    },
    enabled: !!productId,
  });
}

export function usePriceHistory(productId: string) {
  return useQuery({
    queryKey: ['priceHistory', productId],
    queryFn: async () => {
      await delay(300);
      return getMockPriceHistory(productId);
    },
    enabled: !!productId,
  });
}

export function useBestDeals() {
  return useQuery({
    queryKey: ['bestDeals'],
    queryFn: async () => {
      await delay(300);
      return [...MOCK_PRODUCTS]
        .filter((p) => p.inStockCount > 0)
        .sort((a, b) => {
          const savingsA = a.highestPrice - a.lowestPrice;
          const savingsB = b.highestPrice - b.lowestPrice;
          return savingsB - savingsA;
        })
        .slice(0, 5);
    },
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['newArrivals'],
    queryFn: async () => {
      await delay(300);
      return [...MOCK_PRODUCTS].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
    },
  });
}
