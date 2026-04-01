import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Spacing, Typography } from '@/utils/theme';
import { formatPriceCompact } from '@/utils/formatPrice';
import { Ionicons } from '@expo/vector-icons';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
  previousPrice?: number;
}

export function PriceTag({ price, originalPrice, size = 'md', showTrend, previousPrice }: PriceTagProps) {
  const colors = useThemeColors();

  const fontStyle = size === 'lg' ? Typography.price : size === 'md' ? Typography.priceSmall : Typography.caption1;

  const trend = previousPrice ? (price < previousPrice ? 'down' : price > previousPrice ? 'up' : 'same') : null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[fontStyle, { color: colors.text, fontWeight: '700' }]}>
          {formatPriceCompact(price)}
        </Text>
        {showTrend && trend && trend !== 'same' && (
          <Ionicons
            name={trend === 'down' ? 'trending-down' : 'trending-up'}
            size={size === 'lg' ? 18 : 14}
            color={trend === 'down' ? colors.success : colors.danger}
            style={{ marginLeft: Spacing.xs }}
          />
        )}
      </View>
      {originalPrice && originalPrice > price && (
        <Text
          style={[
            Typography.caption1,
            {
              color: colors.textTertiary,
              textDecorationLine: 'line-through',
            },
          ]}
        >
          {formatPriceCompact(originalPrice)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
