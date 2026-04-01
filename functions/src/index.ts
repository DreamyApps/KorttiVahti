import { initializeApp } from 'firebase-admin/app';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest } from 'firebase-functions/v2/https';
import { matchAndUpsertProducts } from './services/productMatcher';
import { sendDailyDealsDigest } from './services/notificationService';

// Verified Scrapers (real, tested selectors)
import { KorttistoppiScraper } from './scrapers/korttistoppi';

// Tier 1 Scrapers (selectors need verification per store)
import { PoromagiaScraper } from './scrapers/poromagia';
import { PuolenkuunPelitScraper } from './scrapers/puolenkuunpelit';
import { FantasiapelitScraper } from './scrapers/fantasiapelit';
import { VerkkokauppaScraper } from './scrapers/verkkokauppa';
import { PelikauppaScraper } from './scrapers/pelikauppa';

// Tier 2 Scrapers
import { TcgKauppaScraper } from './scrapers/tcgkauppa';
import { KaruKorttiScraper } from './scrapers/karukortti';
import { PokeKornerScraper } from './scrapers/pokekorner';
import { InfinityPrintsScraper } from './scrapers/infinityprints';
import { BlockhouseGamesScraper } from './scrapers/blockhousegames';

// Tier 3 Scrapers
import { createTier3Scrapers } from './scrapers/generic';

import type { BaseScraper } from './scrapers/base';

initializeApp();

async function runScrapers(scrapers: BaseScraper[]): Promise<void> {
  for (const scraper of scrapers) {
    try {
      console.log(`Starting scrape: ${scraper.storeName}`);
      const products = await scraper.scrape();
      console.log(`${scraper.storeName}: scraped ${products.length} products`);

      if (products.length > 0) {
        const stats = await matchAndUpsertProducts(scraper.storeId, scraper.storeName, products);
        console.log(
          `${scraper.storeName}: matched=${stats.matched}, new=${stats.new}, updated=${stats.updated}`
        );
      }
    } catch (err) {
      console.error(`Scraper failed for ${scraper.storeName}:`, err);
    }
  }
}

// Scheduled scrape jobs - run every hour, staggered by 15 minutes
export const scrapeTier1 = onSchedule(
  { schedule: '0 * * * *', timeZone: 'Europe/Helsinki', memory: '512MiB', timeoutSeconds: 300 },
  async () => {
    const scrapers = [
      new KorttistoppiScraper(),
      new PoromagiaScraper(),
      new PuolenkuunPelitScraper(),
      new FantasiapelitScraper(),
      new VerkkokauppaScraper(),
      new PelikauppaScraper(),
    ];
    await runScrapers(scrapers);
  }
);

export const scrapeTier2 = onSchedule(
  { schedule: '15 * * * *', timeZone: 'Europe/Helsinki', memory: '512MiB', timeoutSeconds: 300 },
  async () => {
    const scrapers = [
      new TcgKauppaScraper(),
      new KaruKorttiScraper(),
      new PokeKornerScraper(),
      new InfinityPrintsScraper(),
      new BlockhouseGamesScraper(),
    ];
    await runScrapers(scrapers);
  }
);

export const scrapeTier3 = onSchedule(
  { schedule: '30 * * * *', timeZone: 'Europe/Helsinki', memory: '512MiB', timeoutSeconds: 540 },
  async () => {
    const scrapers = createTier3Scrapers();
    await runScrapers(scrapers);
  }
);

// Daily deals digest - sent every morning at 8:00 AM Finnish time
export const dailyDeals = onSchedule(
  { schedule: '0 8 * * *', timeZone: 'Europe/Helsinki' },
  async () => {
    await sendDailyDealsDigest();
  }
);

// Manual trigger endpoint for testing
export const triggerScrape = onRequest(
  { memory: '512MiB', timeoutSeconds: 540 },
  async (req, res) => {
    const tier = req.query.tier as string ?? 'all';

    const tier1 = [
      new KorttistoppiScraper(),
      new PoromagiaScraper(),
      new PuolenkuunPelitScraper(),
      new FantasiapelitScraper(),
      new VerkkokauppaScraper(),
      new PelikauppaScraper(),
    ];

    const tier2 = [
      new TcgKauppaScraper(),
      new KaruKorttiScraper(),
      new PokeKornerScraper(),
      new InfinityPrintsScraper(),
      new BlockhouseGamesScraper(),
    ];

    const tier3 = createTier3Scrapers();

    let scrapers: BaseScraper[] = [];
    if (tier === '1') scrapers = tier1;
    else if (tier === '2') scrapers = tier2;
    else if (tier === '3') scrapers = tier3;
    else scrapers = [...tier1, ...tier2, ...tier3];

    await runScrapers(scrapers);
    res.json({ success: true, tier, scrapersRun: scrapers.length });
  }
);
