import { Pressable, Text, StyleSheet, ActivityIndicator, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Radius, Spacing, Typography } from '@/utils/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  icon,
  style,
  fullWidth,
}: ButtonProps) {
  const colors = useThemeColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const variantStyles = {
    primary: { bg: colors.primary, text: '#09090B' },
    secondary: { bg: colors.surfaceElevated, text: colors.text },
    ghost: { bg: 'transparent', text: colors.primary },
    danger: { bg: colors.dangerMuted, text: colors.danger },
  };

  const sizeStyles = {
    sm: { paddingH: Spacing.md, paddingV: Spacing.sm, font: Typography.caption1 },
    md: { paddingH: Spacing.xl, paddingV: Spacing.md, font: Typography.subhead },
    lg: { paddingH: Spacing.xxl, paddingV: Spacing.lg, font: Typography.headline },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      }}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: v.bg,
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
          opacity: disabled ? 0.5 : 1,
        },
        fullWidth && styles.fullWidth,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, s.font, { color: v.text, fontWeight: '600' }]}>{title}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    textAlign: 'center',
  },
});
