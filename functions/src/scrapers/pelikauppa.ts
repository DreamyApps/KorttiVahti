import * as cheerio from 'cheerio';
import { BaseScraper, type ScrapedProduct } from './base';
import { fetchPage } from '../utils/httpClient';

export class PelikauppaScraper extends BaseScraper {
  readonly storeId = 'pelikauppa';
  readonly storeName = 'Pelikauppa';
  readonly baseUrl = 'https://www.pelikauppa.com';

  async scrape(): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];

    try {
      const urls = [
        `${this.baseUrl}/pelit/korttipelit/pokemon-tcg/`,
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          $('[class*="product"], .tuote, .item-card').each((_, el) => {
            try {
              const $el = $(el);
              const name = $el.find('h3, h2, .product-name, [class*="title"]').first().text().trim();
              const priceText = $el.find('.price, .hinta, [class*="price"]').first().text().trim();
              const link = $el.find('a').first().attr('href') ?? '';
              const img = $el.find('img').first().attr('src') ?? $el.find('img').first().attr('data-src') ?? '';
              const stockEl = $el.find('[class*="stock"], [class*="saatavuus"], .availability');
              const inStock = stockEl.length === 0 || !stockEl.text().toLowerCase().includes('loppu');

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
