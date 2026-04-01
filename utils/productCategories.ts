import type { ProductCategory } from './types';

export interface CategoryInfo {
  key: ProductCategory;
  labelFi: string;
  labelEn: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'booster_box', labelFi: 'Booster Boxit', labelEn: 'Booster Boxes', icon: 'cube-outline' },
  { key: 'etb', labelFi: 'Elite Trainer Boxit', labelEn: 'Elite Trainer Boxes', icon: 'trophy-outline' },
  { key: 'tin', labelFi: 'Tinit', labelEn: 'Tins', icon: 'file-tray-outline' },
  { key: 'collection', labelFi: 'Kokoelmat', labelEn: 'Collections', icon: 'albums-outline' },
  { key: 'blister', labelFi: 'Blisterit', labelEn: 'Blisters', icon: 'pricetag-outline' },
  { key: 'bundle', labelFi: 'Bundlet', labelEn: 'Bundles', icon: 'gift-outline' },
  { key: 'special', labelFi: 'Erikoistuotteet', labelEn: 'Special Products', icon: 'star-outline' },
];

export function getCategoryLabel(key: ProductCategory, lang: 'fi' | 'en'): string {
  const cat = CATEGORIES.find((c) => c.key === key);
  return cat ? (lang === 'fi' ? cat.labelFi : cat.labelEn) : key;
}
