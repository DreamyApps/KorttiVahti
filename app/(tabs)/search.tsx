import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { EmptyState } from '@/components/EmptyState';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Spacing, Typography, Radius } from '@/utils/theme';
import { CATEGORIES } from '@/utils/productCategories';
import type { ProductCategory, SortOption, ViewMode } from '@/utils/types';

export default function SearchScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'fi' | 'en';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { data: products, isLoading } = useProducts(
    category || undefined,
    sort,
    search
  );

  const categoryOptions = [
    { key: '', label: t('search.allCategories') },
    ...CATEGORIES.map((c) => ({
      key: c.key,
      label: lang === 'fi' ? c.labelFi : c.labelEn,
    })),
  ];

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'price_asc', label: t('search.sortOptions.price_asc') },
    { key: 'price_desc', label: t('search.sortOptions.price_desc') },
    { key: 'newest', label: t('search.sortOptions.newest') },
    { key: 'name', label: t('search.sortOptions.name') },
  ];

  const currentSortLabel = sortOptions.find((s) => s.key === sort)?.label ?? '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <SearchBar value={search} onChangeText={setSearch} />

        <View style={styles.controls}>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setShowSortMenu(!showSortMenu);
            }}
            style={[styles.sortButton, { backgroundColor: colors.surfaceElevated }]}
          >
            <Ionicons name="swap-vertical" size={16} color={colors.textSecondary} />
            <Text style={[Typography.caption1, { color: colors.textSecondary }]}>{currentSortLabel}</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setViewMode(viewMode === 'grid' ? 'list' : 'grid');
            }}
            style={[styles.viewToggle, { backgroundColor: colors.surfaceElevated }]}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'grid' : 'list'}
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        {products && (
          <Text style={[Typography.caption1, { color: colors.textTertiary, paddingHorizontal: 4 }]}>
            {t('search.results', { count: products.length })}
          </Text>
        )}
      </View>

      {showSortMenu && (
        <Animated.View
          entering={FadeIn.duration(150)}
          style={[styles.sortMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          {sortOptions.map((opt) => (
            <Pressable
              key={opt.key}
              onPress={() => {
                Haptics.selectionAsync();
                setSort(opt.key);
                setShowSortMenu(false);
              }}
              style={[
                styles.sortMenuItem,
                sort === opt.key && { backgroundColor: colors.primaryMuted },
              ]}
            >
              <Text
                style={[
                  Typography.subhead,
                  {
                    color: sort === opt.key ? colors.primary : colors.text,
                    fontWeight: sort === opt.key ? '600' : '400',
                  },
                ]}
              >
                {opt.label}
              </Text>
              {sort === opt.key && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </Pressable>
          ))}
        </Animated.View>
      )}

      <FilterBar
        options={categoryOptions}
        selected={category}
        onSelect={(key) => setCategory(key as ProductCategory | '')}
      />

      {isLoading ? (
        <View style={styles.loadingGrid}>
          {[0, 1, 2, 3].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </View>
      ) : products && products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            viewMode === 'grid' && styles.gridList,
          ]}
          columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
          renderItem={({ item, index }) => (
            <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
              <ProductCard
                product={item}
                variant={viewMode === 'grid' ? 'compact' : 'wide'}
                index={index}
              />
            </View>
          )}
        />
      ) : (
        <EmptyState
          icon="search-outline"
          title={t('search.noResults')}
          description={t('search.noResultsDesc')}
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
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  viewToggle: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortMenu: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  sortMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 100,
    gap: Spacing.md,
  },
  gridList: {
    gap: Spacing.md,
  },
  gridRow: {
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    maxWidth: '48%',
  },
  listItem: {
    width: '100%',
  },
  loadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
});
