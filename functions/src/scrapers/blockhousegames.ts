import * as cheerio from 'cheerio';
import { BaseScraper, type ScrapedProduct } from './base';
import { fetchPage } from '../utils/httpClient';

export class BlockhouseGamesScraper extends BaseScraper {
  readonly storeId = 'blockhousegames';
  readonly storeName = 'Blockhouse Games';
  readonly baseUrl = 'https://www.blockhousegames.fi';

  async scrape(): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];

    try {
      const urls = [
        `${this.baseUrl}/tuotekategoria/pokemon/`,
        `${this.baseUrl}/tuotekategoria/pokemon-sealed/`,
      ];

      for (const url of urls) {
        try {
          const html = await fetchPage(url);
          const $ = cheerio.load(html);

          $('.product, li.type-product, .product-card').each((_, el) => {
            try {
              const $el = $(el);
              const name = $el.find('.woocommerce-loop-product__title, h2, h3, .product-title').first().text().trim();
              const priceText = $el.find('.price .amount, .price ins .amount').first().text().trim()
                || $el.find('.price').first().text().trim();
              const link = $el.find('a.woocommerce-LoopProduct-link, a').first().attr('href') ?? '';
              const img = $el.find('img').first().attr('src') ?? $el.find('img').first().attr('data-src') ?? '';
              const outOfStock = $el.hasClass('outofstock');

              if (name && priceText && this.isPokemonProduct(name)) {
                const price = this.parsePrice(priceText);
                if (price > 0) {
                  products.push({
                    name,
                    price,
                    inStock: !outOfStock,
                    url: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
                    imageUrl: img.startsWith('http') ? img : img ? `${this.baseUrl}${img}` : '',
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
