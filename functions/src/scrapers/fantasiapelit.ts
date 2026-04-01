import * as cheerio from 'cheerio';
import { BaseScraper, type ScrapedProduct } from './base';
import { fetchPage } from '../utils/httpClient';

export class FantasiapelitScraper extends BaseScraper {
  readonly storeId = 'fantasiapelit';
  readonly storeName = 'Fantasiapelit';
  readonly baseUrl = 'https://www.fantasiapelit.com';

  async scrape(): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];

    try {
      const urls = [
        `${this.baseUrl}/korttipelit/pokemon/sealed/`,
        `${this.baseUrl}/korttipelit/pokemon/`,
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          $('[class*="product"], .tuote, .item').each((_, el) => {
            try {
              const $el = $(el);
              const name = $el.find('h3, h2, .product-name, .tuote-nimi, a[title]').first().text().trim()
                || $el.find('a[title]').first().attr('title') || '';
              const priceText = $el.find('.hinta, .price, [class*="price"]').first().text().trim();
              const link = $el.find('a').first().attr('href') ?? '';
              const img = $el.find('img').first().attr('src') ?? $el.find('img').first().attr('data-src') ?? '';
              const availability = $el.find('[class*="availability"], [class*="stock"], .saatavuus').text().toLowerCase();
              const inStock = !availability.includes('loppu') && !availability.includes('out of stock');

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
              // Skip
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
