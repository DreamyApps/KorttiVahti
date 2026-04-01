import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProduct, fetchListings, fetchPriceHistory } from '@/services/api';
import type { ProductCategory, SortOption } from '@/utils/types';

export function useProducts(category?: ProductCategory, sort?: SortOption, search?: string) {
  return useQuery({
    queryKey: ['products', category, sort, search],
    queryFn: () => fetchProducts(category, sort, search),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
  });
}

export function useProductListings(productId: string) {
  return useQuery({
    queryKey: ['listings', productId],
    queryFn: () => fetchListings(productId),
    enabled: !!productId,
  });
}

export function usePriceHistory(productId: string) {
  return useQuery({
    queryKey: ['priceHistory', productId],
    queryFn: () => fetchPriceHistory(productId),
    enabled: !!productId,
  });
}

export function useBestDeals() {
  return useQuery({
    queryKey: ['bestDeals'],
    queryFn: async () => {
      const products = await fetchProducts();
      return products
        .filter((p) => p.inStockCount > 0)
        .sort((a, b) => {
          const savingsA = a.highestPrice - a.lowestPrice;
          const savingsB = b.highestPrice - b.lowestPrice;
          return savingsB - savingsA;
        })
        .slice(0, 5);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['newArrivals'],
    queryFn: async () => {
      const products = await fetchProducts();
      return [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
    },
    staleTime: 1000 * 60 * 5,
  });
}
