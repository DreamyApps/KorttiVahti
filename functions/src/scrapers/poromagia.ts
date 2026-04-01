import * as cheerio from 'cheerio';
import { BaseScraper, type ScrapedProduct } from './base';
import { fetchPage } from '../utils/httpClient';

export class PoromagiaScraper extends BaseScraper {
  readonly storeId = 'poromagia';
  readonly storeName = 'Poromagia';
  readonly baseUrl = 'https://poromagia.com';

  async scrape(): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];

    try {
      // Poromagia uses category pages for Pokemon TCG sealed products
      const urls = [
        `${this.baseUrl}/kauppa/pokemon-keralykorttipeli/pokemon-sealed-tuotteet`,
        `${this.baseUrl}/kauppa/pokemon-keralykorttipeli/pokemon-booster-boksit`,
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          $('.product-card, .product-item, [class*="product"]').each((_, el) => {
            try {
              const $el = $(el);
              const name = $el.find('.product-card__title, .product-name, h3, h2').first().text().trim();
              const priceText = $el.find('.product-card__price, .price, [class*="price"]').first().text().trim();
              const link = $el.find('a').first().attr('href') ?? '';
              const img = $el.find('img').first().attr('src') ?? $el.find('img').first().attr('data-src') ?? '';
              const inStock = !$el.find('[class*="sold-out"], [class*="out-of-stock"]').length;

              if (name && priceText && this.isPokemonProduct(name)) {
                const price = this.parsePrice(priceText);
                if (price > 0) {
                  products.push({
                    name,
                    price,
                    inStock,
                    url: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
                    imageUrl: img.startsWith('http') ? img : `${this.baseUrl}${img}`,
                  });
                }
              }
            } catch {
              // Skip individual product parse errors
            }
          });
        } catch (err) {
          this.logError(`Failed to scrape ${url}`, err);
        }
      }

      this.log(`Found ${products.length} products`);
    } catch (err) {
      this.logError('Scrape failed', err);
    }

    return products;
  }
}
