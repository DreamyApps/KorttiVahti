import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Spacing, Typography } from '@/utils/theme';
import { Button } from './ui/Button';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surfaceElevated }]}>
        <Ionicons name={icon} size={40} color={colors.textTertiary} />
      </View>
      <Text style={[Typography.title3, { color: colors.text, textAlign: 'center' }]}>{title}</Text>
      <Text
        style={[Typography.subhead, { color: colors.textSecondary, textAlign: 'center', maxWidth: 280 }]}
      >
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="primary" size="md" style={{ marginTop: Spacing.md }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
    gap: Spacing.md,
    paddingBottom: 80,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
});
