import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PriceAlert } from '@/utils/types';

const FAVORITES_KEY = 'korttivahti_favorites';
const ALERTS_KEY = 'korttivahti_alerts';

interface FavoritesState {
  favorites: string[];
  priceAlerts: PriceAlert[];
  loaded: boolean;
  load: () => Promise<void>;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addPriceAlert: (alert: PriceAlert) => void;
  removePriceAlert: (productId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  priceAlerts: [],
  loaded: false,

  load: async () => {
    try {
      const [favsJson, alertsJson] = await Promise.all([
        AsyncStorage.getItem(FAVORITES_KEY),
        AsyncStorage.getItem(ALERTS_KEY),
      ]);
      set({
        favorites: favsJson ? JSON.parse(favsJson) : [],
        priceAlerts: alertsJson ? JSON.parse(alertsJson) : [],
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  toggleFavorite: (productId: string) => {
    const { favorites } = get();
    const next = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];
    set({ favorites: next });
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  },

  isFavorite: (productId: string) => {
    return get().favorites.includes(productId);
  },

  addPriceAlert: (alert: PriceAlert) => {
    const { priceAlerts } = get();
    const next = [...priceAlerts.filter((a) => a.productId !== alert.productId), alert];
    set({ priceAlerts: next });
    AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(next));
  },

  removePriceAlert: (productId: string) => {
    const { priceAlerts } = get();
    const next = priceAlerts.filter((a) => a.productId !== productId);
    set({ priceAlerts: next });
    AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(next));
  },
}));
