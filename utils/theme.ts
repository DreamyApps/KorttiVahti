export const Colors = {
  dark: {
    background: '#09090B',
    surface: '#18181B',
    surfaceElevated: '#27272A',
    primary: '#FBBF24',
    primaryMuted: 'rgba(251, 191, 36, 0.15)',
    secondary: '#60A5FA',
    secondaryMuted: 'rgba(96, 165, 250, 0.15)',
    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    textTertiary: '#71717A',
    success: '#4ADE80',
    successMuted: 'rgba(74, 222, 128, 0.15)',
    danger: '#F87171',
    dangerMuted: 'rgba(248, 113, 113, 0.15)',
    border: '#27272A',
    tabBar: '#111113',
    tabBarBorder: '#1E1E22',
    skeleton: '#27272A',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  light: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceElevated: '#F4F4F5',
    primary: '#D97706',
    primaryMuted: 'rgba(217, 119, 6, 0.1)',
    secondary: '#2563EB',
    secondaryMuted: 'rgba(37, 99, 235, 0.1)',
    text: '#18181B',
    textSecondary: '#71717A',
    textTertiary: '#A1A1AA',
    success: '#16A34A',
    successMuted: 'rgba(22, 163, 74, 0.1)',
    danger: '#DC2626',
    dangerMuted: 'rgba(220, 38, 38, 0.1)',
    border: '#E4E4E7',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E4E4E7',
    skeleton: '#E4E4E7',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
} as const;

export type ThemeColors = (typeof Colors)['dark'] | (typeof Colors)['light'];
export type ColorScheme = 'dark' | 'light';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

export const Typography = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700' as const },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' as const },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const },
  body: { fontSize: 17, lineHeight: 22, fontWeight: '400' as const },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' as const },
  subhead: { fontSize: 15, lineHeight: 20, fontWeight: '400' as const },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: '400' as const },
  price: { fontSize: 20, lineHeight: 25, fontWeight: '700' as const },
  priceSmall: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const },
} as const;
