import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Radius, Spacing, Typography } from '@/utils/theme';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChangeText, onFocus, onBlur, autoFocus }: SearchBarProps) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const borderWidth = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    borderWidth: borderWidth.value,
    borderColor: colors.primary,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceElevated },
        animatedStyle,
      ]}
    >
      <Ionicons name="search" size={20} color={colors.textTertiary} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={t('search.placeholder')}
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        onFocus={() => {
          borderWidth.value = withSpring(1.5, { damping: 15, stiffness: 400 });
          onFocus?.();
        }}
        onBlur={() => {
          borderWidth.value = withSpring(0, { damping: 15, stiffness: 400 });
          onBlur?.();
        }}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    height: '100%',
  },
});
