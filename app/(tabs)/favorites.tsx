import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useFavoritesStore } from '@/hooks/useFavorites';
import { MOCK_PRODUCTS } from '@/utils/mockData';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { Spacing, Typography } from '@/utils/theme';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const { favorites } = useFavoritesStore();

  const favoriteProducts = MOCK_PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={[Typography.largeTitle, { color: colors.text }]}>{t('favorites.title')}</Text>
          {favoriteProducts.length > 0 && (
            <Text style={[Typography.subhead, { color: colors.textSecondary, marginTop: 2 }]}>
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'product' : 'products'}
            </Text>
          )}
        </Animated.View>
      </View>

      {favoriteProducts.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title={t('favorites.empty')}
          description={t('favorites.emptyDesc')}
          actionLabel={t('home.seeAll')}
          onAction={() => router.push('/search')}
        />
      ) : (
        <FlatList
          data={favoriteProducts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <ProductCard product={item} variant="wide" index={index} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
    gap: Spacing.md,
  },
});
