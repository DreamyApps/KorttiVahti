import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useFavoritesStore } from '@/hooks/useFavorites';
import { Radius, Spacing, Typography } from '@/utils/theme';
import { formatPriceCompact } from '@/utils/formatPrice';
import { Badge } from './ui/Badge';
import type { Product } from '@/utils/types';
import { useTranslation } from 'react-i18next';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ProductCardProps {
  product: Product;
  variant?: 'compact' | 'wide';
  index?: number;
}

export function ProductCard({ product, variant = 'compact', index = 0 }: ProductCardProps) {
  const colors = useThemeColors();
  const router = useRouter();
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const scale = useSharedValue(1);
  const fav = isFavorite(product.id);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${product.id}`);
  };

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(product.id);
  };

  const savings = product.highestPrice - product.lowestPrice;

  if (variant === 'wide') {
    return (
      <Animated.View entering={FadeIn.delay(index * 50).duration(300)}>
        <AnimatedPressable
          onPressIn={() => { scale.value = withSpring(0.97, { damping: 15, stiffness: 400 }); }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
          onPress={handlePress}
          style={[styles.wideCard, { backgroundColor: colors.surface }, animatedStyle]}
        >
          <View style={[styles.wideImageContainer, { backgroundColor: colors.surfaceElevated }]}>
            <Image source={{ uri: product.imageUrl }} style={styles.wideImage} contentFit="contain" />
          </View>
          <View style={styles.wideContent}>
            <Text style={[Typography.subhead, { color: colors.text }]} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={[Typography.caption1, { color: colors.textSecondary, marginTop: 2 }]} numberOfLines={1}>
              {product.set}
            </Text>
            <View style={styles.wideBottom}>
              <View>
                <Text style={[Typography.price, { color: colors.primary }]}>
                  {formatPriceCompact(product.lowestPrice)}
                </Text>
                <Text style={[Typography.caption2, { color: colors.textTertiary }]}>
                  {t('home.fromStores', { count: product.storeCount })}
                </Text>
              </View>
              <Badge
                label={product.inStockCount > 0 ? t('home.inStock') : t('home.outOfStock')}
                variant={product.inStockCount > 0 ? 'success' : 'danger'}
              />
            </View>
          </View>
          <Pressable onPress={handleFavorite} style={styles.favButton} hitSlop={12}>
            <Ionicons
              name={fav ? 'heart' : 'heart-outline'}
              size={22}
              color={fav ? colors.danger : colors.textTertiary}
            />
          </Pressable>
        </AnimatedPressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.delay(index * 50).duration(300)}>
      <AnimatedPressable
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 400 }); }}
        onPress={handlePress}
        style={[styles.compactCard, { backgroundColor: colors.surface }, animatedStyle]}
      >
        <View style={[styles.imageContainer, { backgroundColor: colors.surfaceElevated }]}>
          <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="contain" />
          {savings > 5 && (
            <View style={[styles.savingsBadge, { backgroundColor: colors.success }]}>
              <Text style={[Typography.caption2, { color: '#09090B', fontWeight: '700' }]}>
                -{formatPriceCompact(savings)}
              </Text>
            </View>
          )}
          <Pressable onPress={handleFavorite} style={styles.compactFav} hitSlop={12}>
            <Ionicons
              name={fav ? 'heart' : 'heart-outline'}
              size={18}
              color={fav ? colors.danger : colors.textTertiary}
            />
          </Pressable>
        </View>
        <View style={styles.compactContent}>
          <Text style={[Typography.caption1, { color: colors.textSecondary }]} numberOfLines={1}>
            {product.set}
          </Text>
          <Text style={[Typography.subhead, { color: colors.text, fontWeight: '500' }]} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[Typography.priceSmall, { color: colors.primary }]}>
              {formatPriceCompact(product.lowestPrice)}
            </Text>
            <Text style={[Typography.caption2, { color: colors.textTertiary }]}>
              {product.storeCount} 🏪
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    width: 165,
  },
  imageContainer: {
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '70%',
    height: '80%',
  },
  savingsBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  compactFav: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  compactContent: {
    padding: Spacing.md,
    gap: 3,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  wideCard: {
    borderRadius: Radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  wideImageContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wideImage: {
    width: '70%',
    height: '70%',
  },
  wideContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  wideBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.sm,
  },
  favButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
});
