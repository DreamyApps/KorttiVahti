import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Radius, Spacing, Typography } from '@/utils/theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'danger' | 'primary' | 'secondary' | 'muted';
}

export function Badge({ label, variant = 'primary' }: BadgeProps) {
  const colors = useThemeColors();

  const variantStyles = {
    success: { bg: colors.successMuted, text: colors.success },
    danger: { bg: colors.dangerMuted, text: colors.danger },
    primary: { bg: colors.primaryMuted, text: colors.primary },
    secondary: { bg: colors.secondaryMuted, text: colors.secondary },
    muted: { bg: colors.surfaceElevated, text: colors.textSecondary },
  };

  const v = variantStyles[variant];

  return (
    <View style={[styles.badge, { backgroundColor: v.bg }]}>
      <Text style={[styles.label, { color: v.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography.caption1,
    fontWeight: '600',
  },
});
