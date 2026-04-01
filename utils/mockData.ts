import type { Product, Listing, Store, PriceHistoryEntry } from './types';

export const MOCK_STORES: Store[] = [
  { id: 'poromagia', name: 'Poromagia', url: 'https://poromagia.com', logoUrl: '', scrapeEnabled: true, lastScrapeAt: Date.now(), lastScrapeStatus: 'success', productCount: 45 },
  { id: 'puolenkuunpelit', name: 'Puolenkuun Pelit', url: 'https://puolenkuunpelit.com', logoUrl: '', scrapeEnabled: true, lastScrapeAt: Date.now(), lastScrapeStatus: 'success', productCount: 38 },
  { id: 'fantasiapelit', name: 'Fantasiapelit', url: 'https://fantasiapelit.com', logoUrl: '', scrapeEnabled: true, lastScrapeAt: Date.now(), lastScrapeStatus: 'success', productCount: 42 },
  { id: 'verkkokauppa', name: 'Verkkokauppa.com', url: 'https://verkkokauppa.com', logoUrl: '', scrapeEnabled: true, lastScrapeAt: Date.now(), lastScrapeStatus: 'success', productCount: 20 },
  { id: 'pelikauppa', name: 'Pelikauppa', url: 'https://pelikauppa.com', logoUrl: '', scrapeEnabled: true, lastScrapeAt: Date.now(), lastScrapeStatus: 'success', productCount: 30 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Prismatic Evolutions Elite Trainer Box',
    nameFi: 'Prismatic Evolutions Elite Trainer Box',
    nameEn: 'Prismatic Evolutions Elite Trainer Box',
    category: 'etb',
    set: 'Scarlet & Violet - Prismatic Evolutions',
    imageUrl: 'https://images.pokemontcg.io/swsh12pt5/logo.png',
    lowestPrice: 54.90,
    lowestPriceStore: 'poromagia',
    highestPrice: 74.90,
    storeCount: 5,
    inStockCount: 3,
    lastUpdated: Date.now(),
    createdAt: Date.now() - 86400000 * 7,
    tags: ['etb', 'prismatic', 'evolutions', 'eevee'],
  },
  {
    id: '2',
    name: 'Surging Sparks Booster Box',
    nameFi: 'Surging Sparks Booster Box',
    nameEn: 'Surging Sparks Booster Box',
    category: 'booster_box',
    set: 'Scarlet & Violet - Surging Sparks',
    imageUrl: 'https://images.pokemontcg.io/swsh12pt5/logo.png',
    lowestPrice: 119.90,
    lowestPriceStore: 'fantasiapelit',
    highestPrice: 149.90,
    storeCount: 4,
    inStockCount: 4,
    lastUpdated: Date.now(),
    createdAt: Date.now() - 86400000 * 3,
    tags: ['booster', 'surging', 'sparks'],
  },
  {
    id: '3',
    name: 'Paldean Fates Elite Trainer Box',
    nameFi: 'Paldean Fates Elite Trainer Box',
    nameEn: 'Paldean Fates Elite Trainer Box',
    category: 'etb',
    set: 'Scarlet & Violet - Paldean Fates',
    imageUrl: 'https://images.pokemontcg.io/swsh12pt5/logo.png',
    lowestPrice: 49.90,
    lowestPriceStore: 'puolenkuunpelit',
    highestPrice: 59.90,
    storeCount: 3,
    inStockCount: 2,
    lastUpdated: Date.now(),
    createdAt: Date.now() - 86400000 * 14,
    tags: ['etb', 'paldean', 'fates'],
  },
  {
    id: '4',
    name: 'Obsidian Flames Booster Box',
    nameFi: 'Obsidian Flames Booster Box',
    nameEn: 'Obsidian Flames Booster Box',
    category: 'booster_box',
    set: 'Scarlet & Violet - Obsidian Flames',
    imageUrl: 'https://images.pokemontcg.io/swsh12pt5/logo.png',
    lowestPrice: 109.90,
    lowestPriceStore: 'verkkokauppa',
    highestPrice: 139.90,
    storeCount: 5,
    inStockCount: 5,
    lastUpdated: Date.now(),
    createdAt: Date.now() - 86400000 * 30,
    tags: ['booster', 'obsidian', 'flames'],
  },
  {
    id: '5',
    name: 'Charizard ex Premium Collection',
    nameFi: 'Charizard ex Premium Collection',
    nameEn: 'Charizard ex Premium Collection',
    category: 'collection',
    set: 'Scarlet & Violet - Special',
    imageUrl: 'https://images.pokemontcg.io/swsh12pt5/logo.png',
    lowestPrice: 39.90,
    lowestPriceStore: 'poromagia',
    highestPrice: 49.90,
    storeCount: 4,
    inStockCount: 1,
    lastUpdated: Date.now(),
    createdAt: Date.now() - 86400000 * 2,
    tags: ['collection', 'charizard', 'premium'],
  },
  {
    id: '6',
    name: 'Temporal Forces Booster Bundle',
    nameFi: 'Temporal Forces Booster Bundle',
    nameEn: 'Temporal Forces Booster Bundle',
    category: 'bundle',
    set: 'Scarlet & Violet - Temporal Forces',
    imageUrl: 'https://images.pokemontcg.io/swsh12pt5/logo.png',
    lowestPrice: 24.90,
    lowestPriceStore: 'pelikauppa',
    highestPrice: 29.90,
    storeCount: 3,
    inStockCount: 3,
    lastUpdated: Date.now(),
    createdAt: Date.now() - 86400000 * 1,
    tags: ['bundle', 'temporal', 'forces'],
  },
  {
    id: '7',
    name: 'Pikachu V Tin',
    nameFi: 'Pikachu V Tin',
    nameEn: 'Pikachu V Tin',
    category: 'tin',
    set: 'Scarlet & Violet - General',
    imageUrl: 'https://images.pokemontcg.io/swsh12pt5/logo.png',
    lowestPrice: 19.90,
    lowestPriceStore: 'fantasiapelit',
    highestPrice: 24.90,
    storeCount: 5,
    inStockCount: 4,
    lastUpdated: Date.now(),
    createdAt: Date.now() - 86400000 * 5,
    tags: ['tin', 'pikachu'],
  },
  {
    id: '8',
    name: 'Twilight Masquerade Booster Box',
    nameFi: 'Twilight Masquerade Booster Box',
    nameEn: 'Twilight Masquerade Booster Box',
    category: 'booster_box',
    set: 'Scarlet & Violet - Twilight Masquerade',
    imageUrl: 'https://images.pokemontcg.io/swsh12pt5/logo.png',
    lowestPrice: 114.90,
    lowestPriceStore: 'poromagia',
    highestPrice: 134.90,
    storeCount: 4,
    inStockCount: 3,
    lastUpdated: Date.now(),
    createdAt: Date.now() - 86400000 * 10,
    tags: ['booster', 'twilight', 'masquerade'],
  },
];

export function getMockListings(productId: string): Listing[] {
  const base = [
    { storeId: 'poromagia', storeName: 'Poromagia', inStock: true },
    { storeId: 'puolenkuunpelit', storeName: 'Puolenkuun Pelit', inStock: true },
    { storeId: 'fantasiapelit', storeName: 'Fantasiapelit', inStock: true },
    { storeId: 'verkkokauppa', storeName: 'Verkkokauppa.com', inStock: false },
    { storeId: 'pelikauppa', storeName: 'Pelikauppa', inStock: true },
  ];

  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  if (!product) return [];

  const basePrice = product.lowestPrice;
  return base.slice(0, product.storeCount).map((s, i) => ({
    ...s,
    price: basePrice + i * 5,
    url: `https://${s.storeId}.com/product/${productId}`,
    lastSeen: Date.now(),
    lastPriceChange: Date.now() - 86400000 * i,
  }));
}

export function getMockPriceHistory(productId: string): PriceHistoryEntry[] {
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  if (!product) return [];

  const entries: PriceHistoryEntry[] = [];
  const now = Date.now();
  const stores = ['poromagia', 'fantasiapelit', 'puolenkuunpelit'];

  for (let day = 90; day >= 0; day -= 1) {
    const timestamp = now - day * 86400000;
    for (const storeId of stores) {
      const variance = Math.sin(day * 0.1 + stores.indexOf(storeId)) * 10;
      entries.push({
        storeId,
        price: product.lowestPrice + variance + stores.indexOf(storeId) * 5,
        inStock: Math.random() > 0.1,
        timestamp,
      });
    }
  }
  return entries;
}
