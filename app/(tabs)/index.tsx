import { View, Text, ScrollView, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useBestDeals, useNewArrivals, useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { FilterBar } from '@/components/FilterBar';
import { Spacing, Typography } from '@/utils/theme';
import { CATEGORIES } from '@/utils/productCategories';

export default function HomeScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const lang = i18n.language as 'fi' | 'en';

  const { data: deals, isLoading: dealsLoading, refetch: refetchDeals } = useBestDeals();
  const { data: newArrivals, isLoading: arrivalsLoading, refetch: refetchArrivals } = useNewArrivals();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Promise.all([refetchDeals(), refetchArrivals()]);
    setRefreshing(false);
  }, [refetchDeals, refetchArrivals]);

  const categoryOptions = CATEGORIES.map((c) => ({
    key: c.key,
    label: lang === 'fi' ? c.labelFi : c.labelEn,
  }));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={[Typography.largeTitle, { color: colors.text }]}>KorttiVahti</Text>
          <Text style={[Typography.subhead, { color: colors.textSecondary, marginTop: 2 }]}>
            {t('home.greeting')} 👋
          </Text>
        </Animated.View>
      </View>

      {/* Best Deals Section */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <SectionHeader
          title={t('home.bestDeals')}
          icon="flame"
          iconColor={colors.danger}
          colors={colors}
          onSeeAll={() => router.push('/search')}
          seeAllText={t('home.seeAll')}
        />
        {dealsLoading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {[0, 1, 2].map((i) => <ProductCardSkeleton key={i} />)}
          </ScrollView>
        ) : (
          <FlatList
            horizontal
            data={deals}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item, index }) => (
              <ProductCard product={item} variant="compact" index={index} />
            )}
          />
        )}
      </Animated.View>

      {/* Categories */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
        <Text style={[Typography.title3, { color: colors.text, paddingHorizontal: Spacing.lg }]}>
          {t('home.categories')}
        </Text>
        <View style={styles.categoryGrid}>
          {categoryOptions.map((cat) => (
            <CategoryCard
              key={cat.key}
              label={cat.label}
              icon={CATEGORIES.find((c) => c.key === cat.key)?.icon ?? 'cube-outline'}
              colors={colors}
              onPress={() => router.push('/search')}
            />
          ))}
        </View>
      </Animated.View>

      {/* New Arrivals */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)}>
        <SectionHeader
          title={t('home.newArrivals')}
          icon="sparkles"
          iconColor={colors.primary}
          colors={colors}
          onSeeAll={() => router.push('/search')}
          seeAllText={t('home.seeAll')}
        />
        {arrivalsLoading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {[0, 1, 2].map((i) => <ProductCardSkeleton key={i} />)}
          </ScrollView>
        ) : (
          <FlatList
            horizontal
            data={newArrivals}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item, index }) => (
              <ProductCard product={item} variant="compact" index={index} />
            )}
          />
        )}
      </Animated.View>
    </ScrollView>
  );
}

function SectionHeader({
  title,
  icon,
  iconColor,
  colors,
  onSeeAll,
  seeAllText,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  colors: ReturnType<typeof useThemeColors>;
  onSeeAll: () => void;
  seeAllText: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text style={[Typography.title3, { color: colors.text }]}>{title}</Text>
      </View>
      <Text
        onPress={onSeeAll}
        style={[Typography.subhead, { color: colors.primary, fontWeight: '500' }]}
      >
        {seeAllText}
      </Text>
    </View>
  );
}

function CategoryCard({
  label,
  icon,
  colors,
  onPress,
}: {
  label: string;
  icon: string;
  colors: ReturnType<typeof useThemeColors>;
  onPress: () => void;
}) {
  return (
    <View style={[styles.categoryCard, { backgroundColor: colors.surface }]}>
      <Text onPress={onPress} style={[Typography.caption1, { color: colors.text, textAlign: 'center' }]}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
        {'\n'}
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  horizontalList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  section: {
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1.2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.sm,
  },
});
