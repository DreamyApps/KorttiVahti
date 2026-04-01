import { useEffect } from 'react';
import { Text, type TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  style?: TextStyle;
  duration?: number;
}

export function AnimatedNumber({ value, format, style, duration = 500 }: AnimatedNumberProps) {
  const animatedValue = useSharedValue(value);

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration });
  }, [value, duration, animatedValue]);

  const displayText = format ? format(value) : `${value}`;

  return <Text style={style}>{displayText}</Text>;
}
