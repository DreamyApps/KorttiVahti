/**
 * Local test script for verified scrapers.
 * Run with: npx tsx test-scraper.ts
 */
import { KorttistoppiScraper } from './src/scrapers/korttistoppi';

async function main() {
  const scraper = new KorttistoppiScraper();

  console.log(`\n=== Testing ${scraper.storeName} ===\n`);
  const start = Date.now();
  const products = await scraper.scrape();
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`\n=== Results ===`);
  console.log(`Total products: ${products.length}`);
  console.log(`Time: ${elapsed}s`);
  console.log(`In stock: ${products.filter((p) => p.inStock).length}`);
  console.log(`Out of stock: ${products.filter((p) => !p.inStock).length}`);
  console.log(`With discount: ${products.filter((p) => p.originalPrice).length}`);

  const categories = new Map<string, number>();
  for (const p of products) {
    const cat = p.category ?? 'unknown';
    categories.set(cat, (categories.get(cat) ?? 0) + 1);
  }
  console.log(`\nCategories:`);
  for (const [cat, count] of [...categories.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }

  console.log(`\n--- First 10 products ---\n`);
  for (const p of products.slice(0, 10)) {
    const discount = p.originalPrice ? ` (was ${p.originalPrice.toFixed(2)} €)` : '';
    const stock = p.inStock ? '✅' : '❌';
    console.log(`${stock} ${p.name}`);
    console.log(`   ${p.price.toFixed(2)} €${discount}  |  ${p.category ?? '?'}`);
    console.log(`   ${p.url}`);
    console.log();
  }
}

main().catch(console.error);
