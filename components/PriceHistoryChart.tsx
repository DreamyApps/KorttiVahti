import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useState, useMemo } from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Spacing, Typography, Radius } from '@/utils/theme';
import { formatPriceCompact } from '@/utils/formatPrice';
import type { PriceHistoryEntry, PriceRange } from '@/utils/types';
import { useTranslation } from 'react-i18next';

const CHART_HEIGHT = 160;

interface PriceHistoryChartProps {
  data: PriceHistoryEntry[];
  width?: number;
}

export function PriceHistoryChart({ data, width }: PriceHistoryChartProps) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [range, setRange] = useState<PriceRange>('30d');
  const chartWidth = width ?? Dimensions.get('window').width - 80;

  const ranges: { key: PriceRange; label: string }[] = [
    { key: '7d', label: t('product.7d') },
    { key: '30d', label: t('product.30d') },
    { key: '90d', label: t('product.90d') },
    { key: 'all', label: t('product.all') },
  ];

  const filteredData = useMemo(() => {
    const now = Date.now();
    const cutoff = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 9999;
    const threshold = now - cutoff * 86400000;
    return data.filter((d) => d.timestamp >= threshold);
  }, [data, range]);

  const lowestPerDay = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const entry of filteredData) {
      const day = new Date(entry.timestamp).toISOString().split('T')[0];
      const existing = byDay.get(day);
      if (!existing || entry.price < existing) {
        byDay.set(day, entry.price);
      }
    }
    return Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, price]) => price);
  }, [filteredData]);

  const minPrice = lowestPerDay.length > 0 ? Math.min(...lowestPerDay) : 0;
  const maxPrice = lowestPerDay.length > 0 ? Math.max(...lowestPerDay) : 100;
  const priceRange = maxPrice - minPrice || 1;

  const padding = 10;
  const points = lowestPerDay.map((price, i) => {
    const x = (i / Math.max(lowestPerDay.length - 1, 1)) * (chartWidth - padding * 2) + padding;
    const y = CHART_HEIGHT - ((price - minPrice) / priceRange) * (CHART_HEIGHT - padding * 2) - padding;
    return { x, y };
  });

  const pathD = points.length > 1
    ? points.reduce((acc, p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = points[i - 1];
        const cpx = (prev.x + p.x) / 2;
        return `${acc} C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`;
      }, '')
    : '';

  const areaD = pathD && points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${CHART_HEIGHT} L ${points[0].x} ${CHART_HEIGHT} Z`
    : '';

  const lastPoint = points.length > 0 ? points[points.length - 1] : null;

  return (
    <View>
      <View style={styles.rangeRow}>
        {ranges.map((r) => (
          <Pressable
            key={r.key}
            onPress={() => setRange(r.key)}
            style={[
              styles.rangeChip,
              {
                backgroundColor: r.key === range ? colors.primary : colors.surfaceElevated,
              },
            ]}
          >
            <Text
              style={[
                Typography.caption1,
                {
                  color: r.key === range ? '#09090B' : colors.textSecondary,
                  fontWeight: r.key === range ? '700' : '400',
                },
              ]}
            >
              {r.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.yLabels}>
          <Text style={[Typography.caption2, { color: colors.textTertiary }]}>
            {formatPriceCompact(maxPrice)}
          </Text>
          <Text style={[Typography.caption2, { color: colors.textTertiary }]}>
            {formatPriceCompact(minPrice)}
          </Text>
        </View>

        {points.length > 1 ? (
          <Svg width={chartWidth} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={colors.primary} stopOpacity={0.25} />
                <Stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {areaD ? <Path d={areaD} fill="url(#chartGrad)" /> : null}
            <Path d={pathD} fill="none" stroke={colors.primary} strokeWidth={2.5} strokeLinecap="round" />
            {lastPoint && (
              <>
                <Circle cx={lastPoint.x} cy={lastPoint.y} r={5} fill={colors.primary} />
                <Circle cx={lastPoint.x} cy={lastPoint.y} r={3} fill={colors.background} />
              </>
            )}
          </Svg>
        ) : (
          <View style={[styles.noData, { width: chartWidth, height: CHART_HEIGHT }]}>
            <Text style={[Typography.subhead, { color: colors.textTertiary }]}>
              {t('common.loading')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[Typography.caption1, { color: colors.textTertiary }]}>{t('product.lowestPrice')}</Text>
          <Text style={[Typography.priceSmall, { color: colors.success }]}>{formatPriceCompact(minPrice)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[Typography.caption1, { color: colors.textTertiary }]}>{t('product.highestPrice')}</Text>
          <Text style={[Typography.priceSmall, { color: colors.danger }]}>{formatPriceCompact(maxPrice)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rangeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  rangeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  yLabels: {
    justifyContent: 'space-between',
    height: CHART_HEIGHT,
    width: 50,
    paddingVertical: 10,
  },
  noData: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
});
