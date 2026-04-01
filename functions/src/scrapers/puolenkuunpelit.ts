import * as cheerio from 'cheerio';
import { BaseScraper, type ScrapedProduct } from './base';
import { fetchPage } from '../utils/httpClient';

export class PuolenkuunPelitScraper extends BaseScraper {
  readonly storeId = 'puolenkuunpelit';
  readonly storeName = 'Puolenkuun Pelit';
  readonly baseUrl = 'https://www.puolenkuunpelit.com';

  async scrape(): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];

    try {
      const urls = [
        `${this.baseUrl}/tuotteet/korttipelit/pokemon/sealed/`,
        `${this.baseUrl}/tuotteet/korttipelit/pokemon/`,
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          $('.product-list-item, .product, [class*="product-card"]').each((_, el) => {
            try {
              const $el = $(el);
              const name = $el.find('.product-title, .product-name, h3, h2, a[title]').first().text().trim()
                || $el.find('a[title]').first().attr('title') || '';
              const priceText = $el.find('.price, .product-price, [class*="price"]').first().text().trim();
              const link = $el.find('a').first().attr('href') ?? '';
              const img = $el.find('img').first().attr('src') ?? $el.find('img').first().attr('data-src') ?? '';
              const soldOutEl = $el.find('[class*="sold-out"], [class*="unavailable"], .out-of-stock');
              const inStock = soldOutEl.length === 0;

              if (name && priceText && this.isPokemonProduct(name)) {
                const price = this.parsePrice(priceText);
                if (price > 0) {
                  products.push({
                    name,
                    price,
                    inStock,
                    url: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
                    imageUrl: img.startsWith('http') ? img : img ? `${this.baseUrl}${img}` : '',
                  });
                }
              }
            } catch {
              // Skip individual product errors
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
