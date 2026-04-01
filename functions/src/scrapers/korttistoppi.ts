import * as cheerio from 'cheerio';
import type { AnyNode } from 'domhandler';
import { BaseScraper, type ScrapedProduct } from './base';
import { fetchPage } from '../utils/httpClient';
import { detectCategory } from '../utils/nameNormalizer';

const MAX_PAGES = 10;

export class KorttistoppiScraper extends BaseScraper {
  readonly storeId = 'korttistoppi';
  readonly storeName = 'Korttistoppi';
  readonly baseUrl = 'https://www.korttistoppi.fi';

  async scrape(): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];
    const seenUrls = new Set<string>();

    for (let page = 1; page <= MAX_PAGES; page++) {
      try {
        const url = `${this.baseUrl}/tuoteryhma/pokemon?page=${page}`;
        this.log(`Fetching page ${page}...`);
        const html = await fetchPage(url);
        const $ = cheerio.load(html);

        const cards = $('.product-card-grid-item');
        if (cards.length === 0) {
          this.log(`Page ${page}: no products found, stopping pagination`);
          break;
        }

        cards.each((_, el) => {
          try {
            const $card = $(el);
            const product = this.parseProductCard($, $card);
            if (product && !seenUrls.has(product.url)) {
              seenUrls.add(product.url);
              products.push(product);
            }
          } catch {
            // Skip malformed product cards
          }
        });

        this.log(`Page ${page}: parsed ${cards.length} cards (${products.length} total)`);

        // Stop if this was the last page
        const hasNextPage = $(`.pagination a[href*="page=${page + 1}"]`).length > 0
          || $('a[rel="next"]').length > 0;
        if (!hasNextPage) break;

        // Brief delay between pages to be respectful
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        this.logError(`Failed to fetch page ${page}`, err);
        break;
      }
    }

    this.log(`Scrape complete: ${products.length} products found`);
    return products;
  }

  private parseProductCard($: cheerio.CheerioAPI, $card: cheerio.Cheerio<AnyNode>): ScrapedProduct | null {
    const name = $card.find('.product-name-text').first().text().trim();
    if (!name) return null;

    // Price extraction: sale price takes priority over regular price
    const salePrice = $card.find('.text-sale-price').first().text().trim();
    const regularPrice = $card.find('.text-price').first().text().trim();
    const originalPriceText = $card.find('.product-price .text-decoration-line-through').first().text().trim();

    const priceText = salePrice || regularPrice;
    if (!priceText) return null;

    const price = this.parsePrice(priceText);
    if (price <= 0) return null;

    const originalPrice = originalPriceText ? this.parsePrice(originalPriceText) : undefined;

    // Product link
    const linkEl = $card.find('a[href*="/tuote/"]').first();
    const rawHref = linkEl.attr('href') ?? '';
    const productUrl = rawHref.startsWith('http') ? rawHref : `${this.baseUrl}${rawHref}`;
    // Strip the ?category= query param for a cleaner canonical URL
    const cleanUrl = productUrl.split('?')[0];

    // Image: uses lazy loading with data-src
    const imgEl = $card.find('.product-media img').first();
    const imageUrl = imgEl.attr('data-src') ?? imgEl.attr('src') ?? '';

    // Stock detection: "Loppunut" badge means out of stock
    const cardText = $card.text();
    const isOutOfStock = cardText.includes('Loppunut') || cardText.includes('Loppu');
    // Also: in-stock products have a <button data-cart-add="...">
    const hasCartButton = $card.find('button[data-cart-add]').length > 0;
    const inStock = hasCartButton && !isOutOfStock;

    const category = detectCategory(name);

    return {
      name,
      price,
      originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
      inStock,
      url: cleanUrl,
      imageUrl: imageUrl || undefined,
      category,
    };
  }
}
