import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Radius, Spacing, Typography } from '@/utils/theme';
import { formatPriceCompact } from '@/utils/formatPrice';
import { Badge } from './ui/Badge';
import type { Listing } from '@/utils/types';
import { useTranslation } from 'react-i18next';

interface PriceComparisonRowProps {
  listing: Listing;
  isLowest: boolean;
}

export function PriceComparisonRow({ listing, isLowest }: PriceComparisonRowProps) {
  const colors = useThemeColors();
  const { t } = useTranslation();

  const handleVisitStore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(listing.url);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isLowest ? colors.primaryMuted : colors.surface,
          borderColor: isLowest ? colors.primary : colors.border,
        },
      ]}
    >
      <View style={styles.storeInfo}>
        <View style={[styles.storeIcon, { backgroundColor: colors.surfaceElevated }]}>
          <Ionicons name="storefront-outline" size={18} color={colors.textSecondary} />
        </View>
        <View style={styles.storeDetails}>
          <Text style={[Typography.subhead, { color: colors.text, fontWeight: '500' }]}>
            {listing.storeName}
          </Text>
          <Badge
            label={listing.inStock ? t('home.inStock') : t('home.outOfStock')}
            variant={listing.inStock ? 'success' : 'danger'}
          />
        </View>
      </View>
      <View style={styles.priceSection}>
        <View style={styles.priceColumn}>
          <Text
            style={[
              Typography.price,
              {
                color: isLowest ? colors.primary : colors.text,
              },
            ]}
          >
            {formatPriceCompact(listing.price)}
          </Text>
          {isLowest && (
            <Text style={[Typography.caption2, { color: colors.primary, fontWeight: '600' }]}>
              {t('product.lowestPrice')}
            </Text>
          )}
        </View>
        <Pressable
          onPress={handleVisitStore}
          style={[styles.visitButton, { backgroundColor: colors.surfaceElevated }]}
        >
          <Ionicons name="open-outline" size={16} color={colors.secondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  storeIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeDetails: {
    gap: 4,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  visitButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
