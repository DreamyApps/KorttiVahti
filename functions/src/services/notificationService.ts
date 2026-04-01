import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

interface PriceChangeEvent {
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  oldPrice: number;
  newPrice: number;
  inStock: boolean;
}

export async function sendPriceDropNotification(event: PriceChangeEvent): Promise<void> {
  const messaging = getMessaging();

  const body =
    `${event.productName} laski hintaan ${event.newPrice.toFixed(2)} € ` +
    `kaupassa ${event.storeName} (oli ${event.oldPrice.toFixed(2)} €)`;

  try {
    await messaging.send({
      topic: 'price-drops',
      notification: {
        title: '📉 Hinnanalennus!',
        body,
      },
      data: {
        type: 'price_drop',
        productId: event.productId,
        storeId: event.storeId,
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    });
  } catch (err) {
    console.error('Failed to send price drop notification:', err);
  }
}

export async function sendNewProductNotification(
  productName: string,
  productId: string,
  storeCount: number
): Promise<void> {
  const messaging = getMessaging();

  try {
    await messaging.send({
      topic: 'new-products',
      notification: {
        title: '✨ Uusi tuote!',
        body: `${productName} on nyt saatavilla ${storeCount} kaupassa`,
      },
      data: {
        type: 'new_product',
        productId,
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    });
  } catch (err) {
    console.error('Failed to send new product notification:', err);
  }
}

export async function sendBackInStockNotification(
  productName: string,
  productId: string,
  storeName: string
): Promise<void> {
  const messaging = getMessaging();

  try {
    await messaging.send({
      topic: 'back-in-stock',
      notification: {
        title: '📦 Takaisin varastossa!',
        body: `${productName} on taas saatavilla kaupassa ${storeName}`,
      },
      data: {
        type: 'back_in_stock',
        productId,
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    });
  } catch (err) {
    console.error('Failed to send back in stock notification:', err);
  }
}

export async function sendDailyDealsDigest(): Promise<void> {
  const db = getFirestore();
  const messaging = getMessaging();

  try {
    const productsSnapshot = await db
      .collection('products')
      .where('inStockCount', '>', 0)
      .orderBy('inStockCount', 'desc')
      .limit(5)
      .get();

    const count = productsSnapshot.size;
    if (count === 0) return;

    await messaging.send({
      topic: 'daily-deals',
      notification: {
        title: '🏆 Päivän parhaat tarjoukset',
        body: `${count} tuotetta edullisin hinnoin tänään!`,
      },
      data: {
        type: 'daily_deals',
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    });
  } catch (err) {
    console.error('Failed to send daily deals digest:', err);
  }
}

export async function checkPriceAlerts(productId: string, newPrice: number): Promise<void> {
  const db = getFirestore();
  const messaging = getMessaging();

  try {
    const usersSnapshot = await db
      .collection('users')
      .where('priceAlerts', 'array-contains-any', [{ productId }])
      .get();

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const alerts = userData.priceAlerts ?? [];
      const alert = alerts.find((a: any) => a.productId === productId && newPrice <= a.targetPrice);

      if (alert && userData.fcmTokens?.length > 0) {
        const productDoc = await db.collection('products').doc(productId).get();
        const productName = productDoc.data()?.name ?? 'Product';

        for (const token of userData.fcmTokens) {
          try {
            await messaging.send({
              token,
              notification: {
                title: '🎯 Hintahälytys!',
                body: `${productName} on nyt ${newPrice.toFixed(2)} € (tavoitteesi: ${alert.targetPrice.toFixed(2)} €)`,
              },
              data: {
                type: 'price_alert',
                productId,
              },
            });
          } catch {
            // Token might be invalid, skip
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to check price alerts:', err);
  }
}
