import * as cheerio from 'cheerio';
import { BaseScraper, type ScrapedProduct } from './base';
import { fetchPage } from '../utils/httpClient';

export class InfinityPrintsScraper extends BaseScraper {
  readonly storeId = 'infinityprints';
  readonly storeName = 'InfinityPrints TCG';
  readonly baseUrl = 'https://www.infinityprints-tcg.fi';

  async scrape(): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];

    try {
      const urls = [
        `${this.baseUrl}/collections/pokemon`,
        `${this.baseUrl}/collections/pokemon-sealed`,
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          $('.product-card, .grid-item, [class*="product"]').each((_, el) => {
            try {
              const $el = $(el);
              const name = $el.find('[class*="title"], [class*="name"], h3, h2').first().text().trim();
              const priceText = $el.find('[class*="price"], .money').first().text().trim();
              const link = $el.find('a').first().attr('href') ?? '';
              const img = $el.find('img').first().attr('src') ?? $el.find('img').first().attr('data-src') ?? '';
              const soldOut = $el.find('[class*="sold-out"]').length > 0;

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
