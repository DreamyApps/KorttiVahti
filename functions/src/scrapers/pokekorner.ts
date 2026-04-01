import * as cheerio from 'cheerio';
import { BaseScraper, type ScrapedProduct } from './base';
import { fetchPage } from '../utils/httpClient';

export class PokeKornerScraper extends BaseScraper {
  readonly storeId = 'pokekorner';
  readonly storeName = 'PokeKorner';
  readonly baseUrl = 'https://www.pokekorner.fi';

  async scrape(): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];

    try {
      const urls = [
        `${this.baseUrl}/collections/pokemon`,
        `${this.baseUrl}/collections/sealed-products`,
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          // Shopify-style listings
          $('.product-card, .grid-product, [class*="ProductItem"]').each((_, el) => {
            try {
              const $el = $(el);
              const name = $el.find('[class*="title"], [class*="name"], h3, h2').first().text().trim();
              const priceText = $el.find('[class*="price"], .money, .product-price').first().text().trim();
              const link = $el.find('a').first().attr('href') ?? '';
              const img = $el.find('img').first().attr('src') ?? $el.find('img').first().attr('data-src') ?? '';
              const soldOut = $el.find('[class*="sold-out"], .badge--sold-out').length > 0
                || $el.text().toLowerCase().includes('loppuunmyyty');

              if (name && priceText) {
                const price = this.parsePrice(priceText);
                if (price > 0) {
                  products.push({
                    name,
                    price,
                    inStock: !soldOut,
                    url: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
                    imageUrl: img.startsWith('//') ? `https:${img}` : img.startsWith('http') ? img : img ? `${this.baseUrl}${img}` : '',
                  });
                }
              }
            } catch { /* skip */ }
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
