import * as cheerio from 'cheerio';
import { BaseScraper, type ScrapedProduct } from './base';
import { fetchPage } from '../utils/httpClient';

interface GenericScraperConfig {
  storeId: string;
  storeName: string;
  baseUrl: string;
  urls: string[];
  selectors?: {
    container?: string;
    name?: string;
    price?: string;
    link?: string;
    image?: string;
    soldOut?: string;
  };
}

export class GenericScraper extends BaseScraper {
  readonly storeId: string;
  readonly storeName: string;
  readonly baseUrl: string;
  private readonly urls: string[];
  private readonly selectors: Required<NonNullable<GenericScraperConfig['selectors']>>;

  constructor(config: GenericScraperConfig) {
    super();
    this.storeId = config.storeId;
    this.storeName = config.storeName;
    this.baseUrl = config.baseUrl;
    this.urls = config.urls;
    this.selectors = {
      container: config.selectors?.container ?? '.product, [class*="product"], li.type-product, .grid-item, .card',
      name: config.selectors?.name ?? 'h2, h3, [class*="title"], [class*="name"], a[title]',
      price: config.selectors?.price ?? '.price, [class*="price"], .money, .hinta',
      link: config.selectors?.link ?? 'a',
      image: config.selectors?.image ?? 'img',
      soldOut: config.selectors?.soldOut ?? '[class*="sold-out"], [class*="out-of-stock"], [class*="outofstock"], .unavailable',
    };
  }

  async scrape(): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];

    for (const url of this.urls) {
      try {
        const html = await fetchPage(url);
        const $ = cheerio.load(html);

        $(this.selectors.container).each((_, el) => {
          try {
            const $el = $(el);
            const name = $el.find(this.selectors.name).first().text().trim()
              || $el.find('a[title]').first().attr('title') || '';
            const priceText = $el.find(this.selectors.price).first().text().trim();
            const link = $el.find(this.selectors.link).first().attr('href') ?? '';
            const img = $el.find(this.selectors.image).first().attr('src')
              ?? $el.find(this.selectors.image).first().attr('data-src') ?? '';
            const soldOut = $el.find(this.selectors.soldOut).length > 0
              || $el.hasClass('outofstock');

            if (name && priceText && this.isPokemonProduct(name)) {
              const price = this.parsePrice(priceText);
              if (price > 0) {
                const resolveUrl = (u: string) => {
                  if (u.startsWith('http')) return u;
                  if (u.startsWith('//')) return `https:${u}`;
                  return u ? `${this.baseUrl}${u.startsWith('/') ? '' : '/'}${u}` : '';
                };

                products.push({
                  name,
                  price,
                  inStock: !soldOut,
                  url: resolveUrl(link),
                  imageUrl: resolveUrl(img),
                });
              }
            }
          } catch { /* skip individual product */ }
        });
      } catch (err) {
        this.logError(`Failed to scrape ${url}`, err);
      }
    }

    this.log(`Found ${products.length} products`);
    return products;
  }
}

// Tier 3 store configurations
export const tier3Scrapers: GenericScraperConfig[] = [
  {
    storeId: 'ohmygame',
    storeName: 'Oh My Game',
    baseUrl: 'https://www.ohmygame.fi',
    urls: ['https://www.ohmygame.fi/tuotekategoria/pokemon/'],
  },
  {
    storeId: 'kevinshobbies',
    storeName: "Kevin's Hobby Shop",
    baseUrl: 'https://www.kevinshobbies.fi',
    urls: ['https://www.kevinshobbies.fi/collections/pokemon'],
  },
  {
    storeId: 'vpd',
    storeName: 'VPD',
    baseUrl: 'https://www.vpd.fi',
    urls: ['https://www.vpd.fi/tuotekategoria/pokemon/'],
  },
  {
    storeId: 'muksumassi',
    storeName: 'Muksumassi',
    baseUrl: 'https://www.muksumassi.fi',
    urls: ['https://www.muksumassi.fi/tuotekategoria/pokemon/'],
  },
  {
    storeId: 'swagykarp',
    storeName: 'Swagykarp',
    baseUrl: 'https://www.swagykarp.fi',
    urls: ['https://www.swagykarp.fi/collections/pokemon'],
  },
  {
    storeId: 'porvoonpelikauppa',
    storeName: 'Porvoon Pelikauppa',
    baseUrl: 'https://www.porvoonpelikauppa.fi',
    urls: ['https://www.porvoonpelikauppa.fi/tuotekategoria/pokemon/'],
  },
  {
    storeId: 'xslelut',
    storeName: 'XS Lelut',
    baseUrl: 'https://www.xslelut.fi',
    urls: ['https://www.xslelut.fi/tuotekategoria/pokemon/'],
  },
  {
    storeId: 'ellimadelli',
    storeName: 'Ellimadelli',
    baseUrl: 'https://www.ellimadelli.fi',
    urls: ['https://www.ellimadelli.fi/tuotekategoria/pokemon/'],
  },
  {
    storeId: 'prisma',
    storeName: 'Prisma',
    baseUrl: 'https://www.prisma.fi',
    urls: ['https://www.prisma.fi/fi/prisma/haku?query=pokemon+tcg'],
  },
  {
    storeId: 'kodintavaratalo',
    storeName: 'Kodintavaratalo',
    baseUrl: 'https://www.kodintavaratalo.fi',
    urls: ['https://www.kodintavaratalo.fi/haku?q=pokemon+tcg'],
  },
];

export function createTier3Scrapers(): GenericScraper[] {
  return tier3Scrapers.map((config) => new GenericScraper(config));
}
