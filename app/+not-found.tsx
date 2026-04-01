import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColor';
import { EmptyState } from '@/components/EmptyState';
import { useTranslation } from 'react-i18next';

export default function NotFoundScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <EmptyState
        icon="alert-circle-outline"
        title={t('common.error')}
        description="This page does not exist."
        actionLabel={t('tabs.home')}
        onAction={() => router.replace('/')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
