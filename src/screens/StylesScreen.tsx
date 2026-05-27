/**
 * Design-token + asset reference. Sister screen to `ComponentsScreen`
 * (which previews every shared component). Lives at `/styles` on web
 * and is reachable via Profile → Styles on native.
 *
 * Every swatch / row / icon tile is tap-to-copy via `expo-clipboard`
 * + the `Toast` system.
 */

import { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

import { PageTitleBar, PAGE_TITLE_BAR_HEIGHT } from '../components/shared/PageTitleBar';
import { Card } from '../components/shared/Card';
import { TextField } from '../components/shared/TextField';
import { ShimmerGrid } from '../components/shared/ShimmerGrid';
import { CryptoIcon } from '../components/shared/CryptoIcon';
import { GlassIcon, type GlassIconName } from '../components/shared/GlassIcon';
import { PremiumIcon, type PremiumIconName } from '../components/shared/PremiumIcon';
import { DevKitSection } from '../components/shared/DevKitSection';

import { useToast } from '../context/ToastContext';
import { typography, FONT_SIZE } from '../constants/typography';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { RADIUS } from '../constants/ui';

const COLOR_ENTRIES = (Object.entries(COLORS) as [string, string][])
  .filter(([, v]) => typeof v === 'string' && v.startsWith('#'));

const SPACING_ENTRIES = Object.entries(SPACING) as [string, number][];
const RADIUS_ENTRIES  = Object.entries(RADIUS) as [string, number][];

const TYPE_SCALE_ENTRIES = Object.entries(typography) as [
  string,
  { fontSize: number; fontWeight: string; lineHeight?: number; letterSpacing?: number }
][];

const GLASS_ICONS: GlassIconName[] = [
  'wallet', 'card', 'seedling', 'gift', 'bonus', 'shield', 'lock',
  'vault', 'goldBars', 'piggyBank', 'pie', 'chart', 'clipboard',
  'calendar', 'globe', 'brain', 'feedback', 'receipt', 'taxRefund',
  'bankAccount', 'operationalCost', 'companyProfile', 'plan',
  'contract', 'salesContract', 'budget', 'companyBudget', 'growth',
];

const PREMIUM_ICONS: PremiumIconName[] = [
  'bitcoinWallet', 'earn', 'solLoan', 'solUsdcLoan', 'swissBorgLoan', 'transaction',
];

const SATOSHI_WEIGHTS: { label: string; family: string }[] = [
  { label: 'Satoshi Light 300',   family: 'Satoshi-Light'   },
  { label: 'Satoshi Regular 400', family: 'Satoshi-Regular' },
  { label: 'Satoshi Medium 500',  family: 'Satoshi-Medium'  },
  { label: 'Satoshi Bold 700',    family: 'Satoshi-Bold'    },
  { label: 'Satoshi Black 900',   family: 'Satoshi-Black'   },
];

const CRYPTO_SYMBOLS = ['BTC','ETH','SOL','USDC','BORG','BNB','AVAX','ADA','LINK','ARB','DAI','UNI'];

function useCopier() {
  const toast = useToast();
  return (label: string, value: string) => {
    Clipboard.setStringAsync(value);
    toast.success(`Copied ${label}`);
  };
}

export function StylesScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [filter, setFilter] = useState('');
  const copy = useCopier();

  const trimmedFilter = filter.trim();
  const summary = useMemo(() => {
    if (!trimmedFilter) return null;
    return `Filtering by “${trimmedFilter}”. Tap the × to reset.`;
  }, [trimmedFilter]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
      <ShimmerGrid />
      <PageTitleBar title="Styles" scrollY={scrollY} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: PAGE_TITLE_BAR_HEIGHT, paddingBottom: SPACING['4xl'] }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        <View style={{ paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg }}>
          <TextField
            size="search"
            leadingIcon="search-outline"
            placeholder="Search tokens & assets"
            value={filter}
            onChangeText={setFilter}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {summary ? (
            <Pressable onPress={() => setFilter('')} hitSlop={8} style={{ marginTop: SPACING.sm }}>
              <Text style={[typography.label, { color: COLORS.accent }]}>{summary}</Text>
            </Pressable>
          ) : null}
        </View>

        <DevKitSection
          title="Color Tokens (COLORS.*)"
          aliases={['colors', 'palette', 'hex']}
          filter={filter}
          caption="Tap a swatch to copy the hex."
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, gap: SPACING.sm + 2 }}>
            {COLOR_ENTRIES.map(([name, value]) => (
              <Pressable
                key={name}
                onPress={() => copy(`COLORS.${name}`, value)}
                style={{ width: '30%', minWidth: 100, flex: 1 }}
              >
                <View
                  style={{
                    height: 60,
                    borderRadius: RADIUS.card,
                    backgroundColor: value,
                    marginBottom: SPACING.xs + 2,
                    borderWidth: 1,
                    borderColor: COLORS.divider,
                  }}
                />
                <Text style={[typography.labelSemibold, { color: COLORS.foreground, marginBottom: 2 }]}>{name}</Text>
                <Text style={{ color: COLORS.foregroundMuted, fontSize: FONT_SIZE.caption, fontFamily: 'monospace' }}>
                  {value}
                </Text>
              </Pressable>
            ))}
          </View>
        </DevKitSection>

        <DevKitSection
          title="Spacing (SPACING.*)"
          aliases={['spacing', 'padding', 'margin']}
          filter={filter}
          caption="Tap a row to copy the pt value."
        >
          <Card padding="all">
            <View style={{ gap: SPACING.sm + 2 }}>
              {SPACING_ENTRIES.map(([name, value]) => (
                <Pressable
                  key={name}
                  onPress={() => copy(`SPACING.${name}`, String(value))}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}
                >
                  <View style={{
                    width: value, height: 16,
                    backgroundColor: COLORS.accent,
                    borderRadius: RADIUS.sm,
                  }} />
                  <Text style={[typography.bodyMedium, { color: COLORS.foreground, width: 48 }]}>{name}</Text>
                  <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>{value}pt</Text>
                </Pressable>
              ))}
            </View>
          </Card>
        </DevKitSection>

        <DevKitSection
          title="Radius (RADIUS.*)"
          aliases={['radius', 'corner', 'rounded']}
          filter={filter}
          caption="Tap a tile to copy the pt value."
        >
          <Card padding="all">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md + 2 }}>
              {RADIUS_ENTRIES.map(([name, value]) => (
                <Pressable
                  key={name}
                  onPress={() => copy(`RADIUS.${name}`, String(value))}
                  style={{ alignItems: 'center', gap: SPACING.xs }}
                >
                  <View style={{
                    width: 56, height: 56,
                    backgroundColor: COLORS.surface,
                    borderRadius: Math.min(value, 28),
                    borderWidth: 1, borderColor: COLORS.divider,
                  }} />
                  <Text style={[typography.labelSemibold, { color: COLORS.foreground }]}>{name}</Text>
                  <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>
                    {value === 999 ? 'full' : `${value}pt`}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Card>
        </DevKitSection>

        <DevKitSection
          title="Typography (typography.*)"
          aliases={['type', 'font', 'text']}
          filter={filter}
          caption="Tap a style to copy its name."
        >
          <View style={{ paddingHorizontal: SPACING.xl }}>
            {TYPE_SCALE_ENTRIES.map(([name, style], i) => (
              <Pressable
                key={name}
                onPress={() => copy(`typography.${name}`, `typography.${name}`)}
                style={{
                  paddingVertical: SPACING.lg,
                  borderBottomWidth: i < TYPE_SCALE_ENTRIES.length - 1 ? 1 : 0,
                  borderBottomColor: COLORS.divider,
                }}
              >
                <Text style={[style as Record<string, unknown>, { color: COLORS.foreground }]}>€12,480.00</Text>
                <Text style={{ color: COLORS.foregroundMuted, fontSize: FONT_SIZE.label, marginTop: SPACING.xs + 2 }}>
                  {name}  ·  {style.fontSize}px  ·  weight {style.fontWeight}
                  {style.lineHeight ? `  ·  lh ${style.lineHeight}` : ''}
                  {typeof style.letterSpacing === 'number' ? `  ·  ls ${style.letterSpacing}` : ''}
                </Text>
              </Pressable>
            ))}
          </View>
        </DevKitSection>

        <DevKitSection title="Satoshi Typeface" aliases={['satoshi', 'font family']} filter={filter}>
          <Card padding="none" style={{ overflow: 'hidden' }}>
            {SATOSHI_WEIGHTS.map((w, i) => (
              <Pressable
                key={w.label}
                onPress={() => copy(w.family, w.family)}
                style={{
                  paddingHorizontal: SPACING.lg,
                  paddingVertical: SPACING.lg + 2,
                  borderBottomWidth: i < SATOSHI_WEIGHTS.length - 1 ? 1 : 0,
                  borderBottomColor: COLORS.divider,
                }}
              >
                <Text style={{ color: COLORS.foreground, fontSize: FONT_SIZE.titleLarge, fontFamily: w.family }}>
                  Prototype Kit
                </Text>
                <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: SPACING.xs }]}>{w.label}</Text>
              </Pressable>
            ))}
          </Card>
        </DevKitSection>

        <DevKitSection title="CryptoIcon" aliases={['crypto', 'asset', 'token']} filter={filter}>
          <Card padding="all">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.lg }}>
              {CRYPTO_SYMBOLS.map(sym => (
                <View key={sym} style={{ width: 64, alignItems: 'center', gap: SPACING.xs }}>
                  <CryptoIcon symbol={sym} size={36} />
                  <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>{sym}</Text>
                </View>
              ))}
            </View>
          </Card>
        </DevKitSection>

        <DevKitSection title="GlassIcon" aliases={['glass', 'icon']} filter={filter}>
          <Card padding="all">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.lg }}>
              {GLASS_ICONS.map(name => (
                <View key={name} style={{ width: 72, alignItems: 'center' }}>
                  <GlassIcon name={name} size={48} />
                  <Text
                    style={[typography.label, { color: COLORS.foregroundMuted, marginTop: SPACING.xs, textAlign: 'center' }]}
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </DevKitSection>

        <DevKitSection title="PremiumIcon" aliases={['premium', 'illustration', 'hero']} filter={filter}>
          <Card padding="all">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.lg, justifyContent: 'center' }}>
              {PREMIUM_ICONS.map(name => (
                <View key={name} style={{ width: 120, alignItems: 'center' }}>
                  <PremiumIcon name={name} size={96} />
                  <Text
                    style={[typography.label, { color: COLORS.foregroundMuted, marginTop: SPACING.xs, textAlign: 'center' }]}
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </DevKitSection>
      </Animated.ScrollView>
    </View>
  );
}
