import { useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Shared components (the real things — editing any of these updates
//     both the app and this preview screen automatically) ──────────────────
import { PageTitleBar, PAGE_TITLE_BAR_HEIGHT } from '../components/shared/PageTitleBar';
import { Button } from '../components/shared/Button';
import { GlassIcon, type GlassIconName } from '../components/shared/GlassIcon';
import { PremiumIcon, type PremiumIconName } from '../components/shared/PremiumIcon';
import { GlassNavButton } from '../components/shared/GlassNavButton';
import { IconCircle } from '../components/shared/IconCircle';
import { ListRow } from '../components/shared/ListRow';
import { SectionHeader } from '../components/shared/SectionHeader';
import { Card } from '../components/shared/Card';
import { TabSwitcher } from '../components/shared/TabSwitcher';
import { FilterChip } from '../components/shared/FilterChip';
import { ShortcutRow } from '../components/shared/ShortcutRow';
import { ShortcutButton } from '../components/shared/ShortcutButton';
import { EmptyState } from '../components/shared/EmptyState';
import { Badge } from '../components/shared/Badge';
import { TextField } from '../components/shared/TextField';
import { PagerDots } from '../components/shared/PagerDots';
import { CryptoIcon } from '../components/shared/CryptoIcon';
import { StickyBottomBar } from '../components/shared/StickyBottomBar';
import { SummaryCard } from '../components/shared/SummaryCard';
import { InfoCard } from '../components/shared/InfoCard';
import { SuccessScreen } from '../components/shared/SuccessScreen';
import { BottomSheet } from '../components/shared/BottomSheet';
import { ShimmerGrid } from '../components/shared/ShimmerGrid';

import { AppHeader } from '../components/AppHeader';

// ─── Design tokens (the source of truth) ─────────────────────────────────
import { typography, FONT_SIZE } from '../constants/typography';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { RADIUS } from '../constants/ui';

// ─── Token preview data ─────────────────────────────────────────────────────

const COLOR_ENTRIES = (Object.entries(COLORS) as [string, string][])
  .filter(([, v]) => typeof v === 'string' && v.startsWith('#'));

const SPACING_ENTRIES = Object.entries(SPACING) as [string, number][];

const RADIUS_ENTRIES = Object.entries(RADIUS) as [string, number][];

const TYPE_SCALE_ENTRIES = Object.entries(typography) as [
  string,
  { fontSize: number; fontWeight: string; lineHeight?: number; letterSpacing?: number }
][];

function SectionLabel({ title }: { title: string }) {
  return (
    <Text
      style={{
        color: COLORS.foregroundMuted,
        fontSize: FONT_SIZE.label,
        fontWeight: '600',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING['3xl'] - 4,
        paddingBottom: SPACING.md,
      }}
    >
      {title}
    </Text>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={[
        typography.label,
        { color: COLORS.foregroundMuted, paddingHorizontal: SPACING.xl, marginTop: SPACING.sm },
      ]}
    >
      {children}
    </Text>
  );
}

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

export function StylesScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [tab, setTab]       = useState<'Holdings' | 'Earn' | 'Activity'>('Holdings');
  const [chip, setChip]     = useState<'All' | 'DeFi' | 'Layer 1' | 'Memes'>('All');
  const [dotIdx, setDotIdx] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currency, setCurrency]   = useState<'USD' | 'EUR' | 'CHF' | 'GBP'>('USD');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
      <ShimmerGrid />
      <PageTitleBar title="Dev Kit" scrollY={scrollY} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: PAGE_TITLE_BAR_HEIGHT, paddingBottom: SPACING['4xl'] }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >

        {/* ── Buttons ────────────────────────────────────────────────── */}
        <SectionLabel title="Button" />
        <Card padding="all">
          <View style={{ gap: SPACING.sm + 2 }}>
            <View style={{ flexDirection: 'row', gap: SPACING.sm, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button label="Primary"   onPress={() => {}} size="lg" />
              <Button label="Secondary" onPress={() => {}} size="lg" variant="secondary" />
              <Button label="Ghost"     onPress={() => {}} size="lg" variant="ghost" />
            </View>
            <View style={{ flexDirection: 'row', gap: SPACING.sm, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button label="Primary"   onPress={() => {}} />
              <Button label="Secondary" onPress={() => {}} variant="secondary" />
              <Button label="Ghost"     onPress={() => {}} variant="ghost" />
            </View>
            <View style={{ flexDirection: 'row', gap: SPACING.sm, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button label="Primary"   onPress={() => {}} size="sm" />
              <Button label="Secondary" onPress={() => {}} size="sm" variant="secondary" />
              <Button label="Disabled"  onPress={() => {}} size="sm" disabled />
            </View>
          </View>
        </Card>
        <Caption>lg · md · sm  —  primary / secondary / ghost · pill (fully rounded)</Caption>

        {/* ── ShortcutRow + ShortcutButton ───────────────────────────── */}
        <SectionLabel title="ShortcutRow · ShortcutButton" />
        <ShortcutRow>
          <ShortcutButton icon="arrow-up-outline"        label="Send"    />
          <ShortcutButton icon="arrow-down-outline"      label="Receive" />
          <ShortcutButton icon="swap-horizontal-outline" label="Swap"    />
          <ShortcutButton icon="add-circle-outline"      label="Buy"     />
        </ShortcutRow>

        {/* ── IconCircle ───────────────────────────────────────────── */}
        <SectionLabel title="IconCircle" />
        <Card padding="all">
          <View style={{ flexDirection: 'row', gap: SPACING.md + 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <View style={{ alignItems: 'center', gap: SPACING.xs + 2 }}>
              <IconCircle icon="calendar-outline" size="sm" />
              <Text style={[typography.caption, { color: COLORS.foregroundMuted }]}>sm</Text>
            </View>
            <View style={{ alignItems: 'center', gap: SPACING.xs + 2 }}>
              <IconCircle icon="arrow-up-outline" />
              <Text style={[typography.caption, { color: COLORS.foregroundMuted }]}>md (default)</Text>
            </View>
            <View style={{ alignItems: 'center', gap: SPACING.xs + 2 }}>
              <IconCircle icon="arrow-down-outline" size="lg" />
              <Text style={[typography.caption, { color: COLORS.foregroundMuted }]}>lg</Text>
            </View>
            <View style={{ alignItems: 'center', gap: SPACING.xs + 2 }}>
              <IconCircle>
                <MaterialCommunityIcons name="identifier" size={18} color={COLORS.foreground} />
              </IconCircle>
              <Text style={[typography.caption, { color: COLORS.foregroundMuted }]}>children</Text>
            </View>
          </View>
        </Card>

        {/* ── GlassNavButton ─────────────────────────────────────────── */}
        <SectionLabel title="GlassNavButton" />
        <Card padding="all">
          <View style={{ flexDirection: 'row', gap: SPACING.md, alignItems: 'center', flexWrap: 'wrap' }}>
            <GlassNavButton icon="arrow-back" onPress={() => {}} />
            <GlassNavButton icon="close" iconSize={20} onPress={() => {}} />
            <GlassNavButton icon="share-outline" onPress={() => {}} />
            <GlassNavButton icon="ellipsis-horizontal" onPress={() => {}} />
            <GlassNavButton icon="person-add-outline" label="Invite a friend" onPress={() => {}} />
          </View>
        </Card>

        {/* ── Badge ──────────────────────────────────────────────────── */}
        <SectionLabel title="Badge" />
        <Card padding="all">
          <View style={{ gap: SPACING.md }}>
            <View style={{ flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge label="Neutral" tone="neutral" />
              <Badge label="Success" tone="success" />
              <Badge label="Danger"  tone="danger"  />
              <Badge label="Info"    tone="info"    />
              <Badge label="Warning" tone="warning" />
              <Badge label="DEV"     tone="dev"     />
            </View>
            <View style={{ flexDirection: 'row', gap: SPACING.sm, alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge label="DEV"        tone="dev"     size="tag"  />
              <Badge label="3"          tone="badge"   size="pill" />
              <Badge label="+18.4% 30d" tone="success" size="chip" />
              <Badge label="-4.3% 30d"  tone="danger"  size="chip" />
              <Badge label="Featured"   tone="success" size="chip" />
            </View>
          </View>
        </Card>

        {/* ── Card ───────────────────────────────────────────────────── */}
        <SectionLabel title="Card" />
        <Card>
          <View style={{ paddingVertical: SPACING.lg }}>
            <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>Surface card</Text>
            <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: SPACING.xs }]}>
              variant=surface · padding=rows (horizontal only)
            </Text>
          </View>
        </Card>
        <View style={{ height: SPACING.md }} />
        <Card variant="featured" padding="all">
          <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>Featured card</Text>
          <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: SPACING.xs }]}>
            variant=featured · padding=all (16)
          </Text>
        </Card>

        {/* ── SectionHeader ──────────────────────────────────────────── */}
        <SectionLabel title="SectionHeader" />
        <SectionHeader title="Title only" />
        <Card padding="all">
          <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>Card body</Text>
        </Card>
        <View style={{ height: SPACING.lg }} />
        <SectionHeader title="With action" actionLabel="See all" onAction={() => {}} />
        <Card padding="all">
          <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>Card body</Text>
        </Card>

        {/* ── ListRow ────────────────────────────────────────────────── */}
        <SectionLabel title="ListRow" />
        <Card>
          <ListRow
            leading={<IconCircle icon="arrow-down-outline" />}
            primary="Received BTC"
            secondary="Feb 12, 2026"
            value="+$1,240.00"
            valueColor={COLORS.accent}
          />
          <ListRow
            leading={<IconCircle icon="arrow-up-outline" />}
            primary="Sent ETH"
            secondary="Feb 10, 2026"
            value="-$320.50"
            valueColor={COLORS.destructive}
          />
          <ListRow
            leading={<CryptoIcon symbol="ETH" size={36} />}
            primary="Ethereum"
            secondary="ETH"
            value="$4,820.10"
            sublabel="+2.4%"
            sublabelColor={COLORS.accent}
          />
          <ListRow
            leading={<CryptoIcon symbol="SOL" size={36} />}
            primary="Solana"
            secondary="SOL"
            value="$130.40"
            sublabel="-1.2%"
            sublabelColor={COLORS.destructive}
            last
          />
        </Card>

        {/* ── TabSwitcher ────────────────────────────────────────────── */}
        <SectionLabel title="TabSwitcher" />
        <TabSwitcher
          tabs={['Holdings', 'Earn', 'Activity'] as const}
          active={tab}
          onChange={setTab}
        />
        <View style={{ height: SPACING.md }} />
        <TabSwitcher
          tabs={['Trade', 'Trigger', 'Recurring'] as const}
          active="Trade"
          onChange={() => {}}
          scrollable
          compact
        />

        {/* ── FilterChip ─────────────────────────────────────────────── */}
        <SectionLabel title="FilterChip" />
        <View style={{ paddingHorizontal: SPACING.lg, flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' }}>
          {(['All', 'DeFi', 'Layer 1', 'Memes'] as const).map(c => (
            <FilterChip key={c} label={c} active={chip === c} onPress={() => setChip(c)} />
          ))}
        </View>

        {/* ── AppHeader ──────────────────────────────────────────────── */}
        <SectionLabel title="AppHeader" />
        <Card padding="none" style={{ overflow: 'hidden' }}>
          <AppHeader />
        </Card>

        {/* ── PageTitleBar ───────────────────────────────────────────── */}
        <SectionLabel title="PageTitleBar" />
        <Card padding="all">
          <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>
            Sticky top bar for stack screens. Pass `scrollY` to fade the blur background as the screen scrolls.
            Already rendered at the top of this screen.
          </Text>
        </Card>

        {/* ── StickyBottomBar ────────────────────────────────────────── */}
        <SectionLabel title="StickyBottomBar" />
        <Card padding="none" style={{ overflow: 'hidden' }}>
          <View style={{ padding: SPACING.lg }}>
            <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>Detail content…</Text>
          </View>
          <StickyBottomBar>
            <Button label="Secondary" variant="secondary" onPress={() => {}} fullWidth />
            <Button label="Primary"   onPress={() => {}} fullWidth />
          </StickyBottomBar>
        </Card>

        {/* ── TextField ──────────────────────────────────────────────── */}
        <SectionLabel title="TextField" />
        <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
          <TextField label="Default"    placeholder="Recipient address" />
          <TextField label="Search"     size="search" leadingIcon="search-outline" placeholder="Search tokens" />
          <TextField label="Amount"     size="display" placeholder="0" keyboardType="decimal-pad" helper="Balance: 3.14 ETH" />
          <TextField label="With error" placeholder="john@example.com" error="Invalid email address" />
        </View>

        {/* ── EmptyState ─────────────────────────────────────────────── */}
        <SectionLabel title="EmptyState" />
        <Card padding="none">
          <EmptyState
            icon="sparkles-outline"
            title="Nothing here yet"
            subtitle="Empty-state placeholder — drop one into a screen to give context before content arrives."
            action={{ label: 'Get started', onPress: () => {} }}
          />
        </Card>
        <View style={{ height: SPACING.md }} />
        <Card padding="none">
          <EmptyState
            icon="checkmark-circle-outline"
            title="All caught up"
            subtitle="No pending items."
            variant="compact"
          />
        </Card>

        {/* ── SummaryCard ────────────────────────────────────────────── */}
        <SectionLabel title="SummaryCard" />
        <View style={{ paddingHorizontal: SPACING.xl }}>
          <SummaryCard
            rows={[
              { label: 'Subtotal', value: '$1,200.00' },
              { label: 'Fees',     value: '$12.00' },
              { label: 'Total',    value: '$1,212.00' },
            ]}
            footnote="Rows stack with dividers. Use for confirm screens and detail readouts."
          />
        </View>

        {/* ── InfoCard ───────────────────────────────────────────────── */}
        <SectionLabel title="InfoCard" />
        <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
          <InfoCard
            icon={<GlassIcon name="shield" size={36} />}
            title="Secured by design"
            body="Sample InfoCard — title + body + leading icon. Stack two or three for intro slides."
          />
          <InfoCard
            icon={<GlassIcon name="chart" size={36} />}
            title="Insightful"
            body="Pair an InfoCard with a hero illustration for empty / onboarding states."
          />
        </View>

        {/* ── PagerDots ──────────────────────────────────────────────── */}
        <SectionLabel title="PagerDots" />
        <Card padding="all">
          <View style={{ alignItems: 'center', gap: SPACING.md + 2 }}>
            <PagerDots count={4} activeIndex={dotIdx} />
            <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
              {[0, 1, 2, 3].map(i => (
                <FilterChip key={i} label={String(i)} size="sm" active={dotIdx === i} onPress={() => setDotIdx(i)} />
              ))}
            </View>
          </View>
        </Card>

        {/* ── BottomSheet ────────────────────────────────────────────── */}
        <SectionLabel title="BottomSheet" />
        <Card padding="all">
          <View style={{ gap: SPACING.sm + 2 }}>
            <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>
              Currency: <Text style={{ color: COLORS.accent }}>{currency}</Text>
            </Text>
            <Button label="Open sheet" variant="secondary" size="md" onPress={() => setSheetOpen(true)} />
          </View>
        </Card>
        <BottomSheet
          visible={sheetOpen}
          title="Display currency"
          options={['USD', 'EUR', 'CHF', 'GBP'] as const}
          value={currency}
          onChange={v => { setCurrency(v); setSheetOpen(false); }}
          onClose={() => setSheetOpen(false)}
        />

        {/* ── ShimmerGrid ────────────────────────────────────────────── */}
        <SectionLabel title="ShimmerGrid" />
        <Card padding="none" style={{ overflow: 'hidden', height: 180 }}>
          <ShimmerGrid />
          <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>ShimmerGrid background</Text>
            <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: SPACING.xs }]}>
              Place as first child of a full-screen View.
            </Text>
          </View>
        </Card>

        {/* ── SuccessScreen ──────────────────────────────────────────── */}
        <SectionLabel title="SuccessScreen" />
        <Card padding="none" style={{ overflow: 'hidden', height: 540 }}>
          <SuccessScreen
            title="Done"
            amountLabel="All set"
            body="Your action has completed successfully."
            summaryRows={[
              { label: 'Status', value: 'Confirmed' },
            ]}
          />
        </Card>

        {/* ════════════════════════════════════════════════════════════════
            DESIGN TOKENS
        ════════════════════════════════════════════════════════════════ */}

        <SectionLabel title="Color Tokens (COLORS.*)" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, gap: SPACING.sm + 2 }}>
          {COLOR_ENTRIES.map(([name, value]) => (
            <View key={name} style={{ width: '30%', minWidth: 100, flex: 1 }}>
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
            </View>
          ))}
        </View>

        <SectionLabel title="Spacing (SPACING.*)" />
        <Card padding="all">
          <View style={{ gap: SPACING.sm + 2 }}>
            {SPACING_ENTRIES.map(([name, value]) => (
              <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}>
                <View style={{
                  width: value, height: 16,
                  backgroundColor: COLORS.accent,
                  borderRadius: RADIUS.sm,
                }} />
                <Text style={[typography.bodyMedium, { color: COLORS.foreground, width: 48 }]}>{name}</Text>
                <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>{value}pt</Text>
              </View>
            ))}
          </View>
        </Card>

        <SectionLabel title="Radius (RADIUS.*)" />
        <Card padding="all">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md + 2 }}>
            {RADIUS_ENTRIES.map(([name, value]) => (
              <View key={name} style={{ alignItems: 'center', gap: SPACING.xs }}>
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
              </View>
            ))}
          </View>
        </Card>

        <SectionLabel title="Typography (typography.*)" />
        <View style={{ paddingHorizontal: SPACING.xl }}>
          {TYPE_SCALE_ENTRIES.map(([name, style], i) => (
            <View
              key={name}
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
            </View>
          ))}
        </View>

        <SectionLabel title="Satoshi Typeface" />
        <Card padding="none" style={{ overflow: 'hidden' }}>
          {SATOSHI_WEIGHTS.map((w, i) => (
            <View
              key={w.label}
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
            </View>
          ))}
        </Card>

        <SectionLabel title="CryptoIcon" />
        <Card padding="all">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.lg }}>
            {['BTC','ETH','SOL','USDC','BORG','BNB','AVAX','ADA','LINK','ARB','DAI','UNI'].map(sym => (
              <View key={sym} style={{ width: 64, alignItems: 'center', gap: SPACING.xs }}>
                <CryptoIcon symbol={sym} size={36} />
                <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>{sym}</Text>
              </View>
            ))}
          </View>
        </Card>

        <SectionLabel title="GlassIcon" />
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

        <SectionLabel title="PremiumIcon" />
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

      </Animated.ScrollView>

      {/* Suppress unused-import warnings for icons re-exported by the kit. */}
      <View style={{ display: 'none' }}>
        <Ionicons name="close" size={1} />
      </View>
    </View>
  );
}
