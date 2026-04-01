import { View, Text, ScrollView, StyleSheet, Switch, Pressable } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColor';
import { Spacing, Typography, Radius } from '@/utils/theme';

export default function SettingsScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const [priceDrops, setPriceDrops] = useState(true);
  const [newProducts, setNewProducts] = useState(true);
  const [backInStock, setBackInStock] = useState(true);
  const [dailyDeals, setDailyDeals] = useState(false);

  const currentLang = i18n.language;

  const toggleLanguage = () => {
    Haptics.selectionAsync();
    const newLang = currentLang === 'fi' ? 'en' : 'fi';
    i18n.changeLanguage(newLang);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={[Typography.largeTitle, { color: colors.text }]}>{t('settings.title')}</Text>
        </Animated.View>
      </View>

      {/* Language */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <SectionTitle title={t('settings.language')} colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Pressable onPress={toggleLanguage} style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primaryMuted }]}>
                <Ionicons name="language" size={20} color={colors.primary} />
              </View>
              <Text style={[Typography.body, { color: colors.text }]}>{t('settings.language')}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[Typography.subhead, { color: colors.textSecondary }]}>
                {currentLang === 'fi' ? '🇫🇮 Suomi' : '🇬🇧 English'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </View>
          </Pressable>
        </View>
      </Animated.View>

      {/* Notifications */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <SectionTitle title={t('settings.notifications')} colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <ToggleRow
            icon="trending-down"
            iconBg={colors.successMuted}
            iconColor={colors.success}
            label={t('settings.priceDrops')}
            value={priceDrops}
            onToggle={(v) => { Haptics.selectionAsync(); setPriceDrops(v); }}
            colors={colors}
          />
          <Divider colors={colors} />
          <ToggleRow
            icon="sparkles"
            iconBg={colors.primaryMuted}
            iconColor={colors.primary}
            label={t('settings.newProducts')}
            value={newProducts}
            onToggle={(v) => { Haptics.selectionAsync(); setNewProducts(v); }}
            colors={colors}
          />
          <Divider colors={colors} />
          <ToggleRow
            icon="cube"
            iconBg={colors.secondaryMuted}
            iconColor={colors.secondary}
            label={t('settings.backInStock')}
            value={backInStock}
            onToggle={(v) => { Haptics.selectionAsync(); setBackInStock(v); }}
            colors={colors}
          />
          <Divider colors={colors} />
          <ToggleRow
            icon="star"
            iconBg={colors.dangerMuted}
            iconColor={colors.danger}
            label={t('settings.dailyDeals')}
            value={dailyDeals}
            onToggle={(v) => { Haptics.selectionAsync(); setDailyDeals(v); }}
            colors={colors}
          />
        </View>
      </Animated.View>

      {/* Account */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)}>
        <SectionTitle title={t('settings.account')} colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Pressable style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.secondaryMuted }]}>
                <Ionicons name="person" size={20} color={colors.secondary} />
              </View>
              <Text style={[Typography.body, { color: colors.text }]}>{t('settings.signIn')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </Pressable>
        </View>
      </Animated.View>

      {/* About */}
      <Animated.View entering={FadeInDown.delay(400).duration(400)}>
        <SectionTitle title={t('settings.about')} colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <LinkRow icon="document-text" label={t('settings.privacy')} colors={colors} />
          <Divider colors={colors} />
          <LinkRow icon="reader" label={t('settings.terms')} colors={colors} />
          <Divider colors={colors} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.surfaceElevated }]}>
                <Ionicons name="information-circle" size={20} color={colors.textSecondary} />
              </View>
              <Text style={[Typography.body, { color: colors.text }]}>{t('settings.version')}</Text>
            </View>
            <Text style={[Typography.subhead, { color: colors.textTertiary }]}>1.0.0</Text>
          </View>
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.footer}>
        <Text style={[Typography.footnote, { color: colors.textTertiary, textAlign: 'center' }]}>
          {t('settings.madeIn')}
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

function SectionTitle({ title, colors }: { title: string; colors: any }) {
  return (
    <Text
      style={[
        Typography.footnote,
        {
          color: colors.textTertiary,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          paddingHorizontal: Spacing.lg,
          marginTop: Spacing.xxl,
          marginBottom: Spacing.sm,
          fontWeight: '600',
        },
      ]}
    >
      {title}
    </Text>
  );
}

function ToggleRow({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  onToggle,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  colors: any;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={[Typography.body, { color: colors.text }]}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.surfaceElevated, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function LinkRow({ icon, label, colors }: { icon: keyof typeof Ionicons.glyphMap; label: string; colors: any }) {
  return (
    <Pressable style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surfaceElevated }]}>
          <Ionicons name={icon} size={20} color={colors.textSecondary} />
        </View>
        <Text style={[Typography.body, { color: colors.text }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

function Divider({ colors }: { colors: any }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  card: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 0.5,
    marginLeft: 64,
  },
  footer: {
    marginTop: Spacing.xxxl,
    paddingBottom: Spacing.xxl,
  },
});
