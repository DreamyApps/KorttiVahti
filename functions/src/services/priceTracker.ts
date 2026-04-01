import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import {
  sendPriceDropNotification,
  sendBackInStockNotification,
  sendNewProductNotification,
  checkPriceAlerts,
} from './notificationService';

export async function trackPriceChanges(
  storeId: string,
  storeName: string,
  productId: string,
  newPrice: number,
  newInStock: boolean,
  productName: string
): Promise<void> {
  const db = getFirestore();

  const listingRef = db
    .collection('products')
    .doc(productId)
    .collection('listings')
    .doc(storeId);

  const prevListing = await listingRef.get();

  if (!prevListing.exists) {
    // New product from this store
    await sendNewProductNotification(productName, productId, 1);
    return;
  }

  const prevData = prevListing.data()!;
  const prevPrice = prevData.price as number;
  const prevInStock = prevData.inStock as boolean;

  // Price drop detection
  if (newPrice < prevPrice) {
    await sendPriceDropNotification({
      productId,
      productName,
      storeId,
      storeName,
      oldPrice: prevPrice,
      newPrice,
      inStock: newInStock,
    });
    await checkPriceAlerts(productId, newPrice);
  }

  // Back in stock detection
  if (newInStock && !prevInStock) {
    await sendBackInStockNotification(productName, productId, storeName);
  }

  // Record price history on change
  if (newPrice !== prevPrice) {
    await db
      .collection('products')
      .doc(productId)
      .collection('priceHistory')
      .add({
        storeId,
        price: newPrice,
        inStock: newInStock,
        timestamp: FieldValue.serverTimestamp(),
      });
  }
}
