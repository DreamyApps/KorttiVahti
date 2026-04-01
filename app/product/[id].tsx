import { View, Text, ScrollView, StyleSheet, Pressable, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useProduct, useProductListings, usePriceHistory } from '@/hooks/useProducts';
import { useFavoritesStore } from '@/hooks/useFavorites';
import { PriceComparisonRow } from '@/components/PriceComparisonRow';
import { PriceHistoryChart } from '@/components/PriceHistoryChart';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { Spacing, Typography, Radius } from '@/utils/theme';
import { formatPriceCompact } from '@/utils/formatPrice';
import { getCategoryLabel } from '@/utils/productCategories';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'fi' | 'en';

  const { data: product, isLoading: productLoading } = useProduct(id);
  const { data: listings, isLoading: listingsLoading } = useProductListings(id);
  const { data: priceHistory, isLoading: historyLoading } = usePriceHistory(id);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const fav = product ? isFavorite(product.id) : false;
  const savings = product ? product.highestPrice - product.lowestPrice : 0;

  const handleFavorite = () => {
    if (!product) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(product.id);
  };

  const handleShare = async () => {
    if (!product) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Share.share({
      message: `${product.name} - ${formatPriceCompact(product.lowestPrice)} | KorttiVahti`,
    });
  };

  const sortedListings = listings
    ? [...listings].sort((a, b) => a.price - b.price)
    : [];

  if (productLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.backRow, { paddingTop: insets.top + Spacing.sm }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <Skeleton width="100%" height={200} radius={Radius.lg} />
          <Skeleton width="80%" height={24} />
          <Skeleton width="60%" height={18} />
          <Skeleton width="100%" height={80} radius={Radius.lg} />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[Typography.title3, { color: colors.text }]}>{t('common.error')}</Text>
        <Button title={t('common.retry')} onPress={() => router.back()} variant="secondary" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header Image */}
        <Animated.View entering={FadeIn.duration(400)}>
          <View style={[styles.imageSection, { backgroundColor: colors.surfaceElevated }]}>
            <View style={[styles.backRow, { paddingTop: insets.top + Spacing.sm }]}>
              <Pressable onPress={() => router.back()} style={[styles.headerButton, { backgroundColor: colors.overlay }]}>
                <Ionicons name="chevron-back" size={22} color="#FFF" />
              </Pressable>
              <View style={styles.headerActions}>
                <Pressable onPress={handleFavorite} style={[styles.headerButton, { backgroundColor: colors.overlay }]}>
                  <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? colors.danger : '#FFF'} />
                </Pressable>
                <Pressable onPress={handleShare} style={[styles.headerButton, { backgroundColor: colors.overlay }]}>
                  <Ionicons name="share-outline" size={22} color="#FFF" />
                </Pressable>
              </View>
            </View>
            <Image source={{ uri: product.imageUrl }} style={styles.productImage} contentFit="contain" />
          </View>
        </Animated.View>

        {/* Product Info */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.infoSection}>
          <View style={styles.badges}>
            <Badge label={getCategoryLabel(product.category, lang)} variant="primary" />
            <Badge
              label={product.inStockCount > 0 ? t('home.inStock') : t('home.outOfStock')}
              variant={product.inStockCount > 0 ? 'success' : 'danger'}
            />
          </View>

          <Text style={[Typography.title2, { color: colors.text }]}>{product.name}</Text>
          <Text style={[Typography.subhead, { color: colors.textSecondary }]}>{product.set}</Text>

          {/* Price Summary Card */}
          <Card style={{ marginTop: Spacing.lg }}>
            <View style={styles.priceSummary}>
              <View style={styles.priceMain}>
                <Text style={[Typography.caption1, { color: colors.textTertiary }]}>{t('product.lowestPrice')}</Text>
                <Text style={[styles.bigPrice, { color: colors.primary }]}>
                  {formatPriceCompact(product.lowestPrice)}
                </Text>
              </View>
              {savings > 0 && (
                <View style={[styles.savingsCard, { backgroundColor: colors.successMuted }]}>
                  <Ionicons name="arrow-down" size={14} color={colors.success} />
                  <Text style={[Typography.caption1, { color: colors.success, fontWeight: '600' }]}>
                    {t('product.savings')} {formatPriceCompact(savings)}
                  </Text>
                </View>
              )}
              <Text style={[Typography.caption1, { color: colors.textTertiary }]}>
                {t('product.stores', { count: product.storeCount })}
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Price Comparison */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={[Typography.title3, { color: colors.text }]}>{t('product.priceComparison')}</Text>
          {listingsLoading ? (
            <View style={{ gap: Spacing.sm }}>
              <Skeleton width="100%" height={70} radius={Radius.lg} />
              <Skeleton width="100%" height={70} radius={Radius.lg} />
              <Skeleton width="100%" height={70} radius={Radius.lg} />
            </View>
          ) : (
            <View style={{ gap: Spacing.sm }}>
              {sortedListings.map((listing, index) => (
                <PriceComparisonRow
                  key={listing.storeId}
                  listing={listing}
                  isLowest={index === 0}
                />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Price History */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <Text style={[Typography.title3, { color: colors.text }]}>{t('product.priceHistory')}</Text>
          <Card>
            {historyLoading || !priceHistory ? (
              <Skeleton width="100%" height={200} radius={Radius.md} />
            ) : (
              <PriceHistoryChart data={priceHistory} />
            )}
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Sticky Bottom Action */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(300)}
        style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + Spacing.sm }]}
      >
        <View style={styles.bottomContent}>
          <View>
            <Text style={[Typography.caption1, { color: colors.textTertiary }]}>{t('product.lowestPrice')}</Text>
            <Text style={[Typography.price, { color: colors.primary }]}>
              {formatPriceCompact(product.lowestPrice)}
            </Text>
          </View>
          <Button
            title={fav ? t('product.removeFromWatchlist') : t('product.addToWatchlist')}
            onPress={handleFavorite}
            variant={fav ? 'secondary' : 'primary'}
            size="lg"
            icon={<Ionicons name={fav ? 'heart-dislike' : 'heart'} size={18} color={fav ? colors.text : '#09090B'} />}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  imageSection: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  productImage: {
    width: '60%',
    height: '70%',
  },
  infoSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  priceSummary: {
    gap: Spacing.sm,
  },
  priceMain: {
    gap: 4,
  },
  bigPrice: {
    fontSize: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
