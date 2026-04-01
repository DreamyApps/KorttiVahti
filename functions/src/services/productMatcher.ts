import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { normalizeName, detectCategory, similarityScore } from '../utils/nameNormalizer';
import type { ScrapedProduct } from '../scrapers/base';

const SIMILARITY_THRESHOLD = 0.85;

interface CanonicalProduct {
  id: string;
  name: string;
  normalizedName: string;
  category: string;
}

export async function matchAndUpsertProducts(
  storeId: string,
  storeName: string,
  scrapedProducts: ScrapedProduct[]
): Promise<{ matched: number; new: number; updated: number }> {
  const db = getFirestore();
  const stats = { matched: 0, new: 0, updated: 0 };

  const existingSnapshot = await db.collection('products').get();
  const existingProducts: CanonicalProduct[] = existingSnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    normalizedName: normalizeName(doc.data().name),
    category: doc.data().category,
  }));

  for (const scraped of scrapedProducts) {
    try {
      const normalizedScraped = normalizeName(scraped.name);
      const detectedCategory = scraped.category ?? detectCategory(scraped.name);

      // Try to find a matching existing product
      let bestMatch: CanonicalProduct | null = null;
      let bestScore = 0;

      for (const existing of existingProducts) {
        const score = similarityScore(normalizedScraped, existing.normalizedName);
        if (score > bestScore && score >= SIMILARITY_THRESHOLD) {
          bestScore = score;
          bestMatch = existing;
        }
      }

      if (bestMatch) {
        // Update existing product listing
        const listingRef = db
          .collection('products')
          .doc(bestMatch.id)
          .collection('listings')
          .doc(storeId);

        const prevListing = await listingRef.get();
        const prevPrice = prevListing.exists ? prevListing.data()?.price : null;

        await listingRef.set({
          storeId,
          storeName,
          price: scraped.price,
          originalPrice: scraped.originalPrice ?? null,
          inStock: scraped.inStock,
          url: scraped.url,
          lastSeen: FieldValue.serverTimestamp(),
          lastPriceChange: prevPrice !== scraped.price
            ? FieldValue.serverTimestamp()
            : prevListing.data()?.lastPriceChange ?? FieldValue.serverTimestamp(),
        });

        // Record price history if price changed
        if (prevPrice !== null && prevPrice !== scraped.price) {
          await db
            .collection('products')
            .doc(bestMatch.id)
            .collection('priceHistory')
            .add({
              storeId,
              price: scraped.price,
              inStock: scraped.inStock,
              timestamp: FieldValue.serverTimestamp(),
            });
          stats.updated++;
        }

        // Recalculate denormalized fields
        await recalculateProductAggregates(db, bestMatch.id);
        stats.matched++;
      } else {
        // Create new canonical product
        const newProductRef = db.collection('products').doc();
        await newProductRef.set({
          name: scraped.name,
          nameFi: scraped.name,
          nameEn: scraped.name,
          category: detectedCategory,
          set: '',
          imageUrl: scraped.imageUrl ?? '',
          lowestPrice: scraped.price,
          lowestPriceStore: storeId,
          highestPrice: scraped.price,
          storeCount: 1,
          inStockCount: scraped.inStock ? 1 : 0,
          lastUpdated: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
          tags: normalizedScraped.split(' ').filter((w) => w.length > 2),
        });

        // Add listing
        await newProductRef.collection('listings').doc(storeId).set({
          storeId,
          storeName,
          price: scraped.price,
          originalPrice: scraped.originalPrice ?? null,
          inStock: scraped.inStock,
          url: scraped.url,
          lastSeen: FieldValue.serverTimestamp(),
          lastPriceChange: FieldValue.serverTimestamp(),
        });

        // Add to existing products cache for subsequent matches
        existingProducts.push({
          id: newProductRef.id,
          name: scraped.name,
          normalizedName: normalizedScraped,
          category: detectedCategory,
        });

        stats.new++;
      }
    } catch (err) {
      console.error(`Error processing product "${scraped.name}":`, err);
    }
  }

  // Update store metadata
  await db.collection('stores').doc(storeId).set(
    {
      id: storeId,
      name: storeName,
      scrapeEnabled: true,
      lastScrapeAt: FieldValue.serverTimestamp(),
      lastScrapeStatus: 'success',
      productCount: scrapedProducts.length,
    },
    { merge: true }
  );

  return stats;
}

async function recalculateProductAggregates(db: FirebaseFirestore.Firestore, productId: string) {
  const listingsSnapshot = await db
    .collection('products')
    .doc(productId)
    .collection('listings')
    .get();

  const listings = listingsSnapshot.docs.map((d) => d.data());

  if (listings.length === 0) return;

  const prices = listings.map((l) => l.price as number);
  const inStockListings = listings.filter((l) => l.inStock);
  const lowestPrice = Math.min(...prices);
  const lowestListing = listings.find((l) => l.price === lowestPrice);

  await db.collection('products').doc(productId).update({
    lowestPrice,
    lowestPriceStore: lowestListing?.storeId ?? '',
    highestPrice: Math.max(...prices),
    storeCount: listings.length,
    inStockCount: inStockListings.length,
    lastUpdated: FieldValue.serverTimestamp(),
  });
}
