export interface ScrapedProduct {
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  url: string;
  imageUrl?: string;
  category?: string;
}

export abstract class BaseScraper {
  abstract readonly storeId: string;
  abstract readonly storeName: string;
  abstract readonly baseUrl: string;

  abstract scrape(): Promise<ScrapedProduct[]>;

  protected parsePrice(text: string): number {
    const cleaned = text
      .replace(/[^\d,.\-]/g, '')
      .replace(',', '.');

    const match = cleaned.match(/\d+\.?\d*/);
    return match ? parseFloat(match[0]) : 0;
  }

  protected isPokemonProduct(name: string): boolean {
    const lower = name.toLowerCase();
    const pokemonKeywords = [
      'pokemon', 'pokémon', 'pokèmon',
      'booster box', 'booster display',
      'elite trainer box', 'etb',
      'tin', 'blister',
      'premium collection',
      'booster bundle',
      'ultra premium',
      'trainer gallery',
      'pikachu', 'charizard', 'eevee', 'mewtwo',
      'scarlet', 'violet',
      'paldea', 'prismatic',
      'surging sparks', 'obsidian flames',
      'temporal forces', 'twilight masquerade',
      'stellar crown', 'shrouded fable',
    ];
    return pokemonKeywords.some((kw) => lower.includes(kw));
  }

  protected log(message: string): void {
    console.log(`[${this.storeName}] ${message}`);
  }

  protected logError(message: string, error?: any): void {
    console.error(`[${this.storeName}] ERROR: ${message}`, error?.message ?? '');
  }
}
