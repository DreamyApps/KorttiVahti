import { ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Radius, Spacing, Typography } from '@/utils/theme';

interface FilterOption {
  key: string;
  label: string;
}

interface FilterBarProps {
  options: FilterOption[];
  selected: string;
  onSelect: (key: string) => void;
}

export function FilterBar({ options, selected, onSelect }: FilterBarProps) {
  const colors = useThemeColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((opt) => {
        const isActive = opt.key === selected;
        return (
          <Pressable
            key={opt.key}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(opt.key);
            }}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.primary : colors.surfaceElevated,
              },
            ]}
          >
            <Text
              style={[
                Typography.subhead,
                {
                  color: isActive ? '#09090B' : colors.textSecondary,
                  fontWeight: isActive ? '600' : '400',
                },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
});
