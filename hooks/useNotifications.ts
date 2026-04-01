import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import type { EventSubscription } from 'expo-modules-core';
import { registerForPushNotifications } from '@/services/notifications';

export function useNotifications() {
  const router = useRouter();
  const responseListener = useRef<EventSubscription | null>(null);
  const notificationListener = useRef<EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotifications().then((token) => {
      if (token) {
        console.log('Push token:', token);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.productId) {
        router.push(`/product/${data.productId as string}`);
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [router]);
}
