/**
 * Live preview of every shared component. Sister screen to `StylesScreen`
 * (which only shows design tokens). Search field at the top filters by
 * component name + aliases.
 *
 * When adding a new shared component, register a `<DevKitSection>` here
 * AND add a row to DESIGN_SYSTEM.md.
 */

import { useMemo, useRef, useState } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageTitleBar, PAGE_TITLE_BAR_HEIGHT } from '../components/shared/PageTitleBar';
import { Button } from '../components/shared/Button';
import { GlassIcon } from '../components/shared/GlassIcon';
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
import { Switch } from '../components/shared/Switch';
import { Accordion } from '../components/shared/Accordion';
import { Stepper } from '../components/shared/Stepper';
import { PercentChange } from '../components/shared/PercentChange';
import { OtpInput } from '../components/shared/OtpInput';
import { AmountInput } from '../components/shared/AmountInput';
import { QuoteCard } from '../components/shared/QuoteCard';
import { StatusTimeline } from '../components/shared/StatusTimeline';
import { UploadTile } from '../components/shared/UploadTile';
import { DevKitSection } from '../components/shared/DevKitSection';

// Phase A — Portfolio & Numbers
import { LineChart, type LinePoint } from '../components/shared/LineChart';
import { TimeRangePicker, DEFAULT_TIME_RANGES, type DefaultRange } from '../components/shared/TimeRangePicker';
import { HeroBalance } from '../components/shared/HeroBalance';
import { ProgressBar } from '../components/shared/ProgressBar';
import { useHaptic } from '../hooks/useHaptic';

import { AppHeader } from '../components/AppHeader';
import { useToast } from '../context/ToastContext';

import { typography } from '../constants/typography';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';

// Deterministic-ish portfolio chart sample (28 points, gentle upward drift).
const SAMPLE_PORTFOLIO_VALUES: number[] = (() => {
  const out: number[] = [];
  let v = 18450;
  for (let i = 0; i < 28; i++) {
    const wobble = Math.sin(i * 0.7) * 220 + Math.cos(i * 1.31) * 140;
    v += wobble + 90;
    out.push(Math.round(v));
  }
  return out;
})();

export function ComponentsScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [filter, setFilter]   = useState('');
  const [tab, setTab]         = useState<'Holdings' | 'Earn' | 'Activity'>('Holdings');
  const [chip, setChip]       = useState<'All' | 'DeFi' | 'Layer 1' | 'Memes'>('All');
  const [dotIdx, setDotIdx]   = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currency, setCurrency]   = useState<'USD' | 'EUR' | 'CHF' | 'GBP'>('USD');
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);
  const [otp, setOtp]         = useState('');
  const [amount, setAmount]   = useState('1500');
  const [range, setRange]     = useState<DefaultRange>('1D');
  const [progress, setProgress] = useState(0.45);
  const [hoverPt, setHoverPt] = useState<LinePoint | null>(null);
  const haptic = useHaptic();

  const trimmedFilter = filter.trim();
  const summary = useMemo(() => {
    if (!trimmedFilter) return null;
    return `Filtering by “${trimmedFilter}”. Tap the × to reset.`;
  }, [trimmedFilter]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
      <ShimmerGrid />
      <PageTitleBar title="Components" scrollY={scrollY} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: PAGE_TITLE_BAR_HEIGHT, paddingBottom: SPACING['4xl'] }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* ── Search ─────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg }}>
          <TextField
            size="search"
            leadingIcon="search-outline"
            placeholder="Search components"
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

        {/* ── Buttons ────────────────────────────────────────────────── */}
        <DevKitSection
          title="Button"
          filter={filter}
          api="<Button label onPress size? variant? leftIcon? rightIcon? fullWidth? pill? disabled? />"
          caption="lg · md · sm  —  primary / secondary / ghost · pill (fully rounded)"
        >
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
        </DevKitSection>

        {/* ── Switch ─────────────────────────────────────────────────── */}
        <DevKitSection
          title="Switch"
          aliases={['toggle', 'on off']}
          filter={filter}
          api="<Switch value onValueChange disabled? />"
          caption="iOS-style toggle. 51×31 — single size for accessibility. Pair with a ListRow trailing slot."
        >
          <Card padding="all">
            <View style={{ flexDirection: 'row', gap: SPACING.xl, alignItems: 'center', flexWrap: 'wrap' }}>
              <View style={{ alignItems: 'center', gap: SPACING.xs }}>
                <Switch value={switchA} onValueChange={setSwitchA} />
                <Text style={[typography.caption, { color: COLORS.foregroundMuted }]}>on</Text>
              </View>
              <View style={{ alignItems: 'center', gap: SPACING.xs }}>
                <Switch value={switchB} onValueChange={setSwitchB} />
                <Text style={[typography.caption, { color: COLORS.foregroundMuted }]}>off</Text>
              </View>
              <View style={{ alignItems: 'center', gap: SPACING.xs }}>
                <Switch value disabled onValueChange={() => {}} />
                <Text style={[typography.caption, { color: COLORS.foregroundMuted }]}>disabled</Text>
              </View>
            </View>
          </Card>
        </DevKitSection>

        {/* ── Toast (live) ───────────────────────────────────────────── */}
        <DevKitSection
          title="Toast"
          aliases={['snackbar', 'notification']}
          filter={filter}
          api="useToast().success(message, { duration? })"
          caption="Imperative — `useToast()` from `src/context/ToastContext`. Stacks newest on top, auto-dismiss 2.4s."
        >
          <Card padding="all">
            <View style={{ flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' }}>
              <ToastTriggers />
            </View>
          </Card>
        </DevKitSection>

        {/* ── HeroBalance ────────────────────────────────────────────── */}
        <DevKitSection
          title="HeroBalance"
          aliases={['balance', 'hero number', 'portfolio total']}
          filter={filter}
          api="<HeroBalance label? value change? showVisibilityToggle? align? />"
          caption="Top-of-screen big-number. Eye toggle wired to BalanceVisibilityContext — toggling here flips every other balance on screen."
        >
          <Card padding="all">
            <HeroBalance
              label="Total Balance"
              value="€22,148.42"
              change={{ amount: '+€572.30', percent: 2.65, period: '24H' }}
            />
          </Card>
        </DevKitSection>

        {/* ── LineChart ──────────────────────────────────────────────── */}
        <DevKitSection
          title="LineChart"
          aliases={['chart', 'graph', 'sparkline', 'price chart']}
          filter={filter}
          api="<LineChart data variant? height? tone? area? domain? onPointerChange? />"
          caption="Sparkline + interactive variants. Drag on the interactive chart below to see the crosshair + value readout."
        >
          <Card padding="all">
            <View style={{ gap: SPACING.lg }}>
              <View>
                <Text style={[typography.label, { color: COLORS.foregroundMuted, marginBottom: SPACING.sm }]}>
                  Interactive · area · accent
                </Text>
                <LineChart
                  data={SAMPLE_PORTFOLIO_VALUES}
                  height={160}
                  area
                  onPointerChange={setHoverPt}
                />
                <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: SPACING.sm }]}>
                  {hoverPt
                    ? `Point ${hoverPt.x} → €${hoverPt.y.toLocaleString()}`
                    : 'Drag across to inspect'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: SPACING.lg, flexWrap: 'wrap' }}>
                <View style={{ flex: 1, minWidth: 120 }}>
                  <Text style={[typography.label, { color: COLORS.foregroundMuted, marginBottom: SPACING.xs }]}>
                    Sparkline · accent
                  </Text>
                  <LineChart variant="sparkline" data={SAMPLE_PORTFOLIO_VALUES} height={48} strokeWidth={1.5} />
                </View>
                <View style={{ flex: 1, minWidth: 120 }}>
                  <Text style={[typography.label, { color: COLORS.foregroundMuted, marginBottom: SPACING.xs }]}>
                    Sparkline · destructive
                  </Text>
                  <LineChart
                    variant="sparkline"
                    data={SAMPLE_PORTFOLIO_VALUES.slice().reverse()}
                    tone="destructive"
                    height={48}
                    strokeWidth={1.5}
                  />
                </View>
              </View>
            </View>
          </Card>
        </DevKitSection>

        {/* ── TimeRangePicker ────────────────────────────────────────── */}
        <DevKitSection
          title="TimeRangePicker"
          aliases={['time range', 'chart range', '1d 1w 1m']}
          filter={filter}
          api="<TimeRangePicker ranges value onChange />"
          caption="Denser than TabSwitcher — fits under a chart. Selection fires a 'selection' haptic on native."
        >
          <TimeRangePicker ranges={DEFAULT_TIME_RANGES} value={range} onChange={setRange} />
        </DevKitSection>

        {/* ── ProgressBar ────────────────────────────────────────────── */}
        <DevKitSection
          title="ProgressBar"
          aliases={['progress', 'bar', 'loading bar']}
          filter={filter}
          api="<ProgressBar value tone? size? label? trailingLabel? />"
          caption="Linear determinate progress. Tap the buttons below to step through values."
        >
          <Card padding="all">
            <View style={{ gap: SPACING.md }}>
              <ProgressBar
                value={progress}
                label="Onboarding"
                trailingLabel={`${Math.round(progress * 100)}%`}
              />
              <ProgressBar value={0.85} tone="warning" size="lg" label="LTV ratio" trailingLabel="85%" />
              <ProgressBar value={0.32} tone="destructive" size="sm" />
              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                <Button label="−10%" size="sm" variant="secondary" onPress={() => setProgress(p => Math.max(0, p - 0.1))} />
                <Button label="+10%" size="sm" variant="secondary" onPress={() => setProgress(p => Math.min(1, p + 0.1))} />
              </View>
            </View>
          </Card>
        </DevKitSection>

        {/* ── useHaptic ──────────────────────────────────────────────── */}
        <DevKitSection
          title="useHaptic"
          aliases={['haptic', 'vibration', 'feedback', 'hooks']}
          filter={filter}
          api="const haptic = useHaptic(); haptic('selection' | 'success' | 'warning' | 'error' | 'impactLight'|'Medium'|'Heavy')"
          caption="No-op on web. Tap a button to fire each kind on iOS / Android."
        >
          <Card padding="all">
            <View style={{ flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' }}>
              <Button label="selection"    size="sm" variant="secondary" onPress={() => haptic('selection')} />
              <Button label="success"      size="sm" onPress={() => haptic('success')} />
              <Button label="warning"      size="sm" variant="secondary" onPress={() => haptic('warning')} />
              <Button label="error"        size="sm" variant="secondary" onPress={() => haptic('error')} />
              <Button label="impactLight"  size="sm" variant="secondary" onPress={() => haptic('impactLight')} />
              <Button label="impactMedium" size="sm" variant="secondary" onPress={() => haptic('impactMedium')} />
              <Button label="impactHeavy"  size="sm" variant="secondary" onPress={() => haptic('impactHeavy')} />
            </View>
          </Card>
        </DevKitSection>

        {/* ── Accordion ──────────────────────────────────────────────── */}
        <DevKitSection
          title="Accordion"
          aliases={['collapsible', 'expand', 'disclosure']}
          filter={filter}
          api="<Accordion title subtitle? defaultOpen? last?>{...}</Accordion>"
          caption="Stack inside a Card for FAQ / transaction-detail rows."
        >
          <Card padding="rows">
            <Accordion title="What is SwissBorg Earn?" defaultOpen>
              <Text style={[typography.body, { color: COLORS.foregroundMuted }]}>
                Earn yields on supported assets while keeping custody. Rates vary by strategy.
              </Text>
            </Accordion>
            <Accordion title="How are fees calculated?">
              <Text style={[typography.body, { color: COLORS.foregroundMuted }]}>
                A flat 1% spread is taken on Swap. Earn carries no withdrawal fee.
              </Text>
            </Accordion>
            <Accordion title="Is my wallet insured?" last>
              <Text style={[typography.body, { color: COLORS.foregroundMuted }]}>
                Custodial holdings are covered up to the legal maximum in your jurisdiction.
              </Text>
            </Accordion>
          </Card>
        </DevKitSection>

        {/* ── Stepper ────────────────────────────────────────────────── */}
        <DevKitSection
          title="Stepper"
          aliases={['progress', 'wizard', 'steps']}
          filter={filter}
          api="<Stepper current total labels? variant? />"
          caption="Numbered progress (1-indexed). Distinct from PagerDots — labeled and ordered."
        >
          <View style={{ gap: SPACING.lg }}>
            <Stepper current={2} total={4} labels={['Verify', 'Fund', 'Review', 'Done']} />
            <Stepper current={1} total={3} />
            <Stepper current={3} total={4} variant="compact" />
          </View>
        </DevKitSection>

        {/* ── PercentChange ──────────────────────────────────────────── */}
        <DevKitSection
          title="PercentChange"
          aliases={['delta', 'percentage', 'pnl', 'change']}
          filter={filter}
          api="<PercentChange value variant? size? arrow? precision? />"
          caption="Signed %, color + arrow. Use in ListRow trailing slot, hero numbers, or as a pill."
        >
          <Card padding="all">
            <View style={{ gap: SPACING.md }}>
              <View style={{ flexDirection: 'row', gap: SPACING.xl, alignItems: 'center', flexWrap: 'wrap' }}>
                <PercentChange value={2.4} />
                <PercentChange value={-1.1} />
                <PercentChange value={0} />
                <PercentChange value={12.3} size="md" />
              </View>
              <View style={{ flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' }}>
                <PercentChange value={2.4}   variant="pill" />
                <PercentChange value={-1.1}  variant="pill" />
                <PercentChange value={18.42} variant="pill" />
              </View>
            </View>
          </Card>
        </DevKitSection>

        {/* ── OtpInput ───────────────────────────────────────────────── */}
        <DevKitSection
          title="OtpInput"
          aliases={['otp', '2fa', 'code', 'verification']}
          filter={filter}
          api="<OtpInput value onChange length? onComplete? error? autoFocus? />"
          caption="6-digit code input, numeric keyboard, auto-advance, paste-aware."
        >
          <Card padding="all">
            <OtpInput value={otp} onChange={setOtp} autoFocus={false} />
            <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: SPACING.md, textAlign: 'center' }]}>
              Current value: {otp || '— '}
            </Text>
          </Card>
        </DevKitSection>

        {/* ── AmountInput ────────────────────────────────────────────── */}
        <DevKitSection
          title="AmountInput"
          aliases={['amount', 'numeric', 'swap input', 'trade input']}
          filter={filter}
          api="<AmountInput value onChangeText symbol symbolPosition? helper? onMax? onToggleCurrency? />"
          caption="Hero numeric field with optional Max + fiat ↔ crypto toggle."
        >
          <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.lg }}>
            <AmountInput
              value={amount}
              onChangeText={setAmount}
              symbol="$"
              helper="≈ 0.0421 BTC · Balance: $4,200.00"
              onMax={() => setAmount('4200')}
              onToggleCurrency={() => {}}
            />
            <AmountInput
              value="0.5"
              onChangeText={() => {}}
              symbol="BTC"
              symbolPosition="trailing"
              helper="≈ €22,600"
            />
          </View>
        </DevKitSection>

        {/* ── QuoteCard ──────────────────────────────────────────────── */}
        <DevKitSection
          title="QuoteCard"
          aliases={['swap confirm', 'review', 'rate']}
          filter={filter}
          api="<QuoteCard from={{label, amount, symbol, secondary?}} to={...} meta? />"
          caption="Confirmation summary for swap / send / deposit flows."
        >
          <QuoteCard
            from={{ label: 'You send', amount: '0.50', symbol: 'BTC', secondary: '≈ €22,600' }}
            to={{   label: 'You get',  amount: '4.21', symbol: 'ETH', secondary: '≈ €22,520' }}
            meta={[
              { label: 'Rate',     value: '1 BTC = 8.42 ETH' },
              { label: 'Fee',      value: '€2.10' },
              { label: 'Slippage', value: '0.5%' },
              { label: 'ETA',      value: '< 1 min', valueColor: COLORS.accent },
            ]}
          />
        </DevKitSection>

        {/* ── StatusTimeline ─────────────────────────────────────────── */}
        <DevKitSection
          title="StatusTimeline"
          aliases={['timeline', 'status', 'progress vertical']}
          filter={filter}
          api="<StatusTimeline current steps=[{title, detail?}] />"
          caption="Transaction / KYC status. `current` is 0-indexed; earlier = done, later = upcoming."
        >
          <Card padding="all">
            <StatusTimeline
              current={1}
              steps={[
                { title: 'Sent',      detail: '12:01 · 0x4a…b9c2' },
                { title: 'Confirmed', detail: 'Waiting for finality' },
                { title: 'Settled',   detail: 'Funds available in wallet' },
              ]}
            />
          </Card>
        </DevKitSection>

        {/* ── UploadTile ─────────────────────────────────────────────── */}
        <DevKitSection
          title="UploadTile"
          aliases={['kyc', 'document upload', 'file picker']}
          filter={filter}
          api="<UploadTile title hint? status? onPress? fileName? error? icon? />"
          caption="KYC document affordance — mock-only (no real picker)."
        >
          <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
            <UploadTile title="Front of ID" hint="JPG or PNG, up to 8 MB" onPress={() => {}} />
            <UploadTile title="Back of ID"  status="uploaded" fileName="back-id.jpg" />
            <UploadTile title="Selfie"      status="error" error="Could not detect a face — try better lighting." />
          </View>
        </DevKitSection>

        {/* ── ShortcutRow + ShortcutButton ───────────────────────────── */}
        <DevKitSection
          title="ShortcutRow · ShortcutButton"
          aliases={['quick actions']}
          filter={filter}
          api="<ShortcutRow><ShortcutButton icon label onPress? /></ShortcutRow>"
        >
          <ShortcutRow>
            <ShortcutButton icon="arrow-up-outline"        label="Send"    />
            <ShortcutButton icon="arrow-down-outline"      label="Receive" />
            <ShortcutButton icon="swap-horizontal-outline" label="Swap"    />
            <ShortcutButton icon="add-circle-outline"      label="Buy"     />
          </ShortcutRow>
        </DevKitSection>

        {/* ── IconCircle ───────────────────────────────────────────── */}
        <DevKitSection
          title="IconCircle"
          filter={filter}
          api="<IconCircle icon? size?>{children?}</IconCircle>"
        >
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
        </DevKitSection>

        {/* ── GlassNavButton ─────────────────────────────────────────── */}
        <DevKitSection
          title="GlassNavButton"
          aliases={['header button']}
          filter={filter}
          api="<GlassNavButton icon onPress iconSize? label? />"
        >
          <Card padding="all">
            <View style={{ flexDirection: 'row', gap: SPACING.md, alignItems: 'center', flexWrap: 'wrap' }}>
              <GlassNavButton icon="arrow-back" onPress={() => {}} />
              <GlassNavButton icon="close" iconSize={20} onPress={() => {}} />
              <GlassNavButton icon="share-outline" onPress={() => {}} />
              <GlassNavButton icon="ellipsis-horizontal" onPress={() => {}} />
              <GlassNavButton icon="person-add-outline" label="Invite a friend" onPress={() => {}} />
            </View>
          </Card>
        </DevKitSection>

        {/* ── Badge ──────────────────────────────────────────────────── */}
        <DevKitSection
          title="Badge"
          aliases={['tag', 'pill', 'chip']}
          filter={filter}
          api="<Badge label tone? size? />"
        >
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
        </DevKitSection>

        {/* ── Card ───────────────────────────────────────────────────── */}
        <DevKitSection
          title="Card"
          aliases={['surface', 'container']}
          filter={filter}
          api='<Card variant? padding? noMargin?>{children}</Card>'
        >
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
        </DevKitSection>

        {/* ── SectionHeader ──────────────────────────────────────────── */}
        <DevKitSection
          title="SectionHeader"
          filter={filter}
          api="<SectionHeader title actionLabel? onAction? />"
        >
          <SectionHeader title="Title only" />
          <Card padding="all">
            <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>Card body</Text>
          </Card>
          <View style={{ height: SPACING.lg }} />
          <SectionHeader title="With action" actionLabel="See all" onAction={() => {}} />
          <Card padding="all">
            <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>Card body</Text>
          </Card>
        </DevKitSection>

        {/* ── ListRow ────────────────────────────────────────────────── */}
        <DevKitSection
          title="ListRow"
          aliases={['row', 'list item']}
          filter={filter}
          api="<ListRow leading primary secondary? value? sublabel? trailing? onPress? last? />"
        >
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
              trailing={<PercentChange value={2.4} variant="pill" />}
            />
            <ListRow
              leading={<CryptoIcon symbol="SOL" size={36} />}
              primary="Solana"
              secondary="SOL"
              value="$130.40"
              trailing={<PercentChange value={-1.2} variant="pill" />}
              last
            />
          </Card>
        </DevKitSection>

        {/* ── TabSwitcher ────────────────────────────────────────────── */}
        <DevKitSection
          title="TabSwitcher"
          aliases={['segmented control']}
          filter={filter}
          api="<TabSwitcher tabs active onChange scrollable? compact? />"
        >
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
        </DevKitSection>

        {/* ── FilterChip ─────────────────────────────────────────────── */}
        <DevKitSection
          title="FilterChip"
          aliases={['chip', 'filter']}
          filter={filter}
          api="<FilterChip label active onPress size? />"
        >
          <View style={{ paddingHorizontal: SPACING.lg, flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' }}>
            {(['All', 'DeFi', 'Layer 1', 'Memes'] as const).map(c => (
              <FilterChip key={c} label={c} active={chip === c} onPress={() => setChip(c)} />
            ))}
          </View>
        </DevKitSection>

        {/* ── AppHeader ──────────────────────────────────────────────── */}
        <DevKitSection title="AppHeader" filter={filter}>
          <Card padding="none" style={{ overflow: 'hidden' }}>
            <AppHeader />
          </Card>
        </DevKitSection>

        {/* ── PageTitleBar ───────────────────────────────────────────── */}
        <DevKitSection
          title="PageTitleBar"
          filter={filter}
          api="<PageTitleBar title? scrollY? right? />"
        >
          <Card padding="all">
            <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>
              Sticky top bar for stack screens. Pass `scrollY` to fade the blur background as the screen scrolls.
              Already rendered at the top of this screen.
            </Text>
          </Card>
        </DevKitSection>

        {/* ── StickyBottomBar ────────────────────────────────────────── */}
        <DevKitSection
          title="StickyBottomBar"
          aliases={['cta bar', 'footer actions']}
          filter={filter}
          api="<StickyBottomBar>{...}</StickyBottomBar>"
        >
          <Card padding="none" style={{ overflow: 'hidden' }}>
            <View style={{ padding: SPACING.lg }}>
              <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>Detail content…</Text>
            </View>
            <StickyBottomBar>
              <Button label="Secondary" variant="secondary" onPress={() => {}} fullWidth />
              <Button label="Primary"   onPress={() => {}} fullWidth />
            </StickyBottomBar>
          </Card>
        </DevKitSection>

        {/* ── TextField ──────────────────────────────────────────────── */}
        <DevKitSection
          title="TextField"
          aliases={['input', 'form field']}
          filter={filter}
          api="<TextField label? helper? error? leadingIcon? leadingElement? size? ...TextInputProps />"
        >
          <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
            <TextField label="Default"    placeholder="Recipient address" />
            <TextField label="Search"     size="search" leadingIcon="search-outline" placeholder="Search tokens" />
            <TextField label="Amount"     size="display" placeholder="0" keyboardType="decimal-pad" helper="Balance: 3.14 ETH" />
            <TextField label="With error" placeholder="john@example.com" error="Invalid email address" />
          </View>
        </DevKitSection>

        {/* ── EmptyState ─────────────────────────────────────────────── */}
        <DevKitSection title="EmptyState" filter={filter} api="<EmptyState icon title subtitle? action? variant? />">
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
        </DevKitSection>

        {/* ── SummaryCard ────────────────────────────────────────────── */}
        <DevKitSection
          title="SummaryCard"
          aliases={['summary', 'totals']}
          filter={filter}
          api="<SummaryCard rows=[{label, value, valueColor?, sublabel?, valueFrom?}] footnote? />"
        >
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
        </DevKitSection>

        {/* ── InfoCard ───────────────────────────────────────────────── */}
        <DevKitSection title="InfoCard" filter={filter} api="<InfoCard icon title body />">
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
        </DevKitSection>

        {/* ── PagerDots ──────────────────────────────────────────────── */}
        <DevKitSection title="PagerDots" filter={filter} api="<PagerDots count activeIndex />">
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
        </DevKitSection>

        {/* ── BottomSheet ────────────────────────────────────────────── */}
        <DevKitSection
          title="BottomSheet"
          aliases={['modal', 'picker']}
          filter={filter}
          api="<BottomSheet visible title options value onChange onClose />"
        >
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
        </DevKitSection>

        {/* ── ShimmerGrid ────────────────────────────────────────────── */}
        <DevKitSection title="ShimmerGrid" filter={filter} api="<ShimmerGrid />">
          <Card padding="none" style={{ overflow: 'hidden', height: 180 }}>
            <ShimmerGrid />
            <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>ShimmerGrid background</Text>
              <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: SPACING.xs }]}>
                Place as first child of a full-screen View.
              </Text>
            </View>
          </Card>
        </DevKitSection>

        {/* ── SuccessScreen ──────────────────────────────────────────── */}
        <DevKitSection
          title="SuccessScreen"
          aliases={['success', 'confirmation']}
          filter={filter}
          api="<SuccessScreen title amountLabel? body? summaryRows? action? />"
        >
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
        </DevKitSection>

      </Animated.ScrollView>

      {/* Suppress unused-import warnings for icons re-exported by the kit. */}
      <View style={{ display: 'none' }}>
        <Ionicons name="close" size={1} />
      </View>
    </View>
  );
}

function ToastTriggers() {
  const toast = useToast();
  return (
    <>
      <Button label="Success" size="sm" onPress={() => toast.success('All saved')} />
      <Button label="Error"   size="sm" variant="secondary" onPress={() => toast.error('Network timeout')} />
      <Button label="Info"    size="sm" variant="secondary" onPress={() => toast.info('Heads-up')} />
      <Button label="Warning" size="sm" variant="secondary" onPress={() => toast.warning('Low balance')} />
    </>
  );
}
