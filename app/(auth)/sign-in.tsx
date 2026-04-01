import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Button } from '@/components/ui/Button';
import { Spacing, Typography } from '@/utils/theme';

export default function SignInScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  const handleAppleSignIn = () => {
    // TODO: Implement Apple Sign-In with @react-native-firebase/auth
    console.log('Apple Sign-In tapped');
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In
    console.log('Google Sign-In tapped');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text
          onPress={() => router.back()}
          style={[Typography.body, { color: colors.primary }]}
        >
          {t('common.cancel')}
        </Text>
      </View>

      <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryMuted }]}>
          <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
        </View>

        <Text style={[Typography.title1, { color: colors.text, textAlign: 'center' }]}>
          KorttiVahti
        </Text>

        <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center', maxWidth: 300 }]}>
          {t('settings.signIn')}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.buttons}>
        <Button
          title="Sign in with Apple"
          onPress={handleAppleSignIn}
          variant="secondary"
          size="lg"
          fullWidth
          icon={<Ionicons name="logo-apple" size={20} color={colors.text} />}
        />

        <Button
          title="Sign in with Google"
          onPress={handleGoogleSignIn}
          variant="secondary"
          size="lg"
          fullWidth
          icon={<Ionicons name="logo-google" size={20} color={colors.text} />}
        />
      </Animated.View>

      <Text
        style={[
          Typography.caption1,
          { color: colors.textTertiary, textAlign: 'center', paddingBottom: insets.bottom + Spacing.lg },
        ]}
      >
        {t('settings.privacy')} · {t('settings.terms')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  buttons: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
});
