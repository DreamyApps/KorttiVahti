import { useColorScheme } from 'react-native';
import { Colors } from '@/utils/theme';

type ColorKeys = keyof typeof Colors.dark;
type ResolvedColors = { [K in ColorKeys]: string };

export function useThemeColors(): ResolvedColors {
  const scheme = useColorScheme();
  return Colors[scheme === 'light' ? 'light' : 'dark'] as ResolvedColors;
}

export function useThemeColor(colorKey: ColorKeys): string {
  const colors = useThemeColors();
  return colors[colorKey];
}

export function useIsDark(): boolean {
  const scheme = useColorScheme();
  return scheme !== 'light';
}
