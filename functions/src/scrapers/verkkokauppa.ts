import * as cheerio from 'cheerio';
import { BaseScraper, type ScrapedProduct } from './base';
import { fetchPage } from '../utils/httpClient';

export class VerkkokauppaScraper extends BaseScraper {
  readonly storeId = 'verkkokauppa';
  readonly storeName = 'Verkkokauppa.com';
  readonly baseUrl = 'https://www.verkkokauppa.com';

  async scrape(): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];

    try {
      // Verkkokauppa.com often has a JSON API or structured product pages
      const searchUrl = `${this.baseUrl}/fi/catalog/83b_Pokemon-keralykortit/products`;

      try {
        const html = await fetchPage(searchUrl);
        const $ = cheerio.load(html);

        $('[data-product], .product-card, [class*="ProductCard"]').each((_, el) => {
          try {
            const $el = $(el);
            const name = $el.find('[class*="name"], [class*="title"], h3, h2').first().text().trim();
            const priceText = $el.find('[class*="price"], [class*="Price"]').first().text().trim();
            const link = $el.find('a').first().attr('href') ?? '';
            const img = $el.find('img').first().attr('src') ?? '';
            const stockText = $el.find('[class*="stock"], [class*="availability"]').text().toLowerCase();
            const inStock = !stockText.includes('ei saatavilla') && !stockText.includes('loppu');

            if (name && priceText && this.isPokemonProduct(name)) {
              const price = this.parsePrice(priceText);
              if (price > 0) {
                products.push({
                  name,
                  price,
                  inStock,
                  url: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
                  imageUrl: img,
                });
              }
            }
          } catch {
            // Skip
          }
        });
      } catch (err) {
        this.logError('Search page scrape failed', err);
      }

      this.log(`Found ${products.length} products`);
    } catch (err) {
      this.logError('Scrape failed', err);
    }

    return products;
  }
}
