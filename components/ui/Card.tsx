import { View, StyleSheet, type ViewProps } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Radius, Spacing } from '@/utils/theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
  noPadding?: boolean;
}

export function Card({ elevated, noPadding, style, children, ...props }: CardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
        },
        !noPadding && styles.padded,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  padded: {
    padding: Spacing.lg,
  },
});
