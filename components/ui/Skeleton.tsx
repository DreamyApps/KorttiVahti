import { useEffect } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Radius } from '@/utils/theme';

interface SkeletonProps {
  width: number | string;
  height: number;
  radius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height, radius = Radius.sm, style }: SkeletonProps) {
  const colors = useThemeColors();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.4, 0.8]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius: radius,
          backgroundColor: colors.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  const colors = useThemeColors();
  return (
    <Animated.View style={[skeletonStyles.card, { backgroundColor: colors.surface }]}>
      <Skeleton width="100%" height={140} radius={Radius.lg} />
      <Animated.View style={skeletonStyles.content}>
        <Skeleton width="80%" height={14} />
        <Skeleton width="50%" height={12} style={{ marginTop: 6 }} />
        <Skeleton width="40%" height={16} style={{ marginTop: 8 }} />
      </Animated.View>
    </Animated.View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    width: 160,
  },
  content: {
    padding: 12,
  },
});
