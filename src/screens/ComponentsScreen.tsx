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

// Phase B — Money Movement
import { InlineAlert } from '../components/shared/InlineAlert';
import { AmountChips, type AmountChipOption } from '../components/shared/AmountChips';
import { TokenPickerChip } from '../components/shared/TokenPickerChip';
import { NumericKeypad } from '../components/shared/NumericKeypad';
import { SwapPanel } from '../components/shared/SwapPanel';
import { SwipeToConfirm } from '../components/shared/SwipeToConfirm';

// Phase C — Lists, Search & Filtering
import { SearchBar } from '../components/shared/SearchBar';
import { SearchableList } from '../components/shared/SearchableList';
import { DateGroupedList } from '../components/shared/DateGroupedList';
import { TransactionRow, type TxKind } from '../components/shared/TransactionRow';
import { StickyFilterBar } from '../components/shared/StickyFilterBar';
import { SettingsGroup } from '../components/shared/SettingsGroup';
import { RefreshScroll } from '../components/shared/RefreshScroll';

// Phase D — Onboarding, KYC & Sheets
import { ActionSheet } from '../components/shared/ActionSheet';
import { Slider } from '../components/shared/Slider';
import { InfoTooltip } from '../components/shared/InfoTooltip';
import { CountrySelect } from '../components/shared/CountrySelect';
import { CameraGuide } from '../components/shared/CameraGuide';
import { DocumentScanFrame } from '../components/shared/DocumentScanFrame';
import { YieldCard } from '../components/shared/YieldCard';
import { findCountry, type Country } from '../data/countries';

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

  // Phase B state
  const [keypadValue, setKeypadValue] = useState('0');
  const [chipValue, setChipValue]     = useState<string | undefined>('5');
  const [swapFrom, setSwapFrom]       = useState('0.50');
  const [swapTo,   setSwapTo]         = useState('4.21');
  const [swapFromSym, setSwapFromSym] = useState('BTC');
  const [swapToSym,   setSwapToSym]   = useState('ETH');
  const [alertOpen, setAlertOpen]     = useState(true);
  const [swipeCount, setSwipeCount]   = useState(0);
  const [swipeKey, setSwipeKey]       = useState(0); // reset SwipeToConfirm

  // Phase C state
  const [searchQ, setSearchQ]         = useState('');
  const [tokenQ, setTokenQ]           = useState('');
  const [txFilter, setTxFilter]       = useState('all');
  const [refreshTick, setRefreshTick] = useState(0);
  const [settingsToggles, setSettingsToggles] = useState({
    marketing: false,
    productNews: true,
    biometrics: true,
  });

  // Phase D state
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [actionResult, setActionResult] = useState<string | null>(null);
  const [slippage, setSlippage] = useState(0.5);
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState<Country | undefined>(findCountry('CH'));
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  const [docCaptured, setDocCaptured] = useState(false);

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

        {/* ── AmountChips ────────────────────────────────────────────── */}
        <DevKitSection
          title="AmountChips"
          aliases={['preset amounts', 'quick amounts', 'tips']}
          filter={filter}
          api="<AmountChips options=[{label,value}|{label,custom}] active onSelect />"
          caption="Preset-amount row for tipping, top-ups, suggested deposits. Pair with AmountInput."
        >
          <AmountChips
            active={chipValue}
            onSelect={opt =>
              'value' in opt ? setChipValue(opt.value) : setChipValue('__custom__')
            }
            options={[
              { label: '€0',     value: '0' },
              { label: '€1',     value: '1' },
              { label: '€5',     value: '5' },
              { label: '€10',    value: '10' },
              { label: 'Custom', custom: true },
            ]}
          />
        </DevKitSection>

        {/* ── TokenPickerChip ────────────────────────────────────────── */}
        <DevKitSection
          title="TokenPickerChip"
          aliases={['token chip', 'currency picker']}
          filter={filter}
          api="<TokenPickerChip symbol onPress? size? />"
          caption="Embeddable token chip. Opens a token-picker BottomSheet on press; render without onPress for a fixed pair."
        >
          <Card padding="all">
            <View style={{ flexDirection: 'row', gap: SPACING.md, alignItems: 'center', flexWrap: 'wrap' }}>
              <TokenPickerChip symbol="BTC"  onPress={() => {}} />
              <TokenPickerChip symbol="ETH"  onPress={() => {}} />
              <TokenPickerChip symbol="USDC" onPress={() => {}} />
              <TokenPickerChip symbol="SOL"  size="sm" onPress={() => {}} />
              <TokenPickerChip symbol="BORG" />
            </View>
          </Card>
        </DevKitSection>

        {/* ── NumericKeypad ──────────────────────────────────────────── */}
        <DevKitSection
          title="NumericKeypad"
          aliases={['numpad', 'in-app keyboard', 'amount entry']}
          filter={filter}
          api="<NumericKeypad value onChange maxLength? allowDecimal? disabled? />"
          caption="In-app 3×4 numpad. Long-press ⌫ to clear. Selection haptic on every tap."
        >
          <View style={{ gap: SPACING.lg }}>
            <Card padding="all">
              <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>Current value</Text>
              <Text style={[typography.display, { color: COLORS.foreground, marginTop: SPACING.xs }]}>
                {keypadValue || '0'}
              </Text>
            </Card>
            <NumericKeypad value={keypadValue} onChange={setKeypadValue} maxLength={10} />
          </View>
        </DevKitSection>

        {/* ── SwapPanel ──────────────────────────────────────────────── */}
        <DevKitSection
          title="SwapPanel"
          aliases={['swap input', 'exchange', 'trade panel']}
          filter={filter}
          api="<SwapPanel from to onSwapDirection? />"
          caption="Dual From/To input with center swap button. Use QuoteCard on the confirm screen, not here."
        >
          <SwapPanel
            from={{
              label: 'You send',
              symbol: swapFromSym,
              amount: swapFrom,
              caption: `Balance: 0.42 ${swapFromSym}`,
              onAmountChange: setSwapFrom,
              onTokenPress: () => {},
            }}
            to={{
              label: 'You get',
              symbol: swapToSym,
              amount: swapTo,
              caption: '≈ €22,520',
              onAmountChange: setSwapTo,
              onTokenPress: () => {},
            }}
            onSwapDirection={() => {
              setSwapFromSym(swapToSym);
              setSwapToSym(swapFromSym);
              setSwapFrom(swapTo);
              setSwapTo(swapFrom);
            }}
          />
        </DevKitSection>

        {/* ── SwipeToConfirm ─────────────────────────────────────────── */}
        <DevKitSection
          title="SwipeToConfirm"
          aliases={['slide to confirm', 'drag to send', 'confirm cta']}
          filter={filter}
          api="<SwipeToConfirm label onConfirm confirmLabel? tone? disabled? />"
          caption="Drag-to-confirm CTA. Fires a 'success' haptic on commit. Confirmed: {count} times this session."
        >
          <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
            <SwipeToConfirm
              key={swipeKey}
              label="Slide to send €120.50"
              onConfirm={() => setSwipeCount(c => c + 1)}
            />
            <SwipeToConfirm
              key={swipeKey + 1000}
              label="Slide to delete account"
              confirmLabel="Deleted"
              tone="destructive"
              onConfirm={() => setSwipeCount(c => c + 1)}
            />
            <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
              <Button label="Reset" size="sm" variant="secondary" onPress={() => setSwipeKey(k => k + 1)} />
              <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>
                  Confirmed {swipeCount}× this session
                </Text>
              </View>
            </View>
          </View>
        </DevKitSection>

        {/* ── InlineAlert ────────────────────────────────────────────── */}
        <DevKitSection
          title="InlineAlert"
          aliases={['banner', 'alert', 'in-screen notice']}
          filter={filter}
          api="<InlineAlert tone? title? message? action? onDismiss? icon? />"
          caption="Sticky in-screen banner. Distinct from Toast — InlineAlert stays until dismissed."
        >
          <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
            <InlineAlert
              tone="info"
              title="Heads-up"
              message="Trading on the BORG pair is paused for maintenance until 18:00 UTC."
              action={{ label: 'Read status page', onPress: () => {} }}
            />
            <InlineAlert
              tone="success"
              message="Your KYC submission is complete. Most accounts verify within 24h."
            />
            <InlineAlert
              tone="warning"
              title="Slippage is high"
              message="Estimated slippage of 4.2% — your trade could execute below the quoted rate."
              action={{ label: 'Adjust', onPress: () => {} }}
            />
            {alertOpen ? (
              <InlineAlert
                tone="danger"
                title="LTV is approaching the liquidation threshold"
                message="At 82% your collateral may be sold. Add funds or repay."
                action={{ label: 'Add collateral', onPress: () => {} }}
                onDismiss={() => setAlertOpen(false)}
              />
            ) : (
              <Button label="Restore dismissed alert" size="sm" variant="secondary" onPress={() => setAlertOpen(true)} />
            )}
          </View>
        </DevKitSection>

        {/* ── SearchBar ──────────────────────────────────────────────── */}
        <DevKitSection
          title="SearchBar"
          aliases={['search field', 'find']}
          filter={filter}
          api="<SearchBar value onChangeText placeholder? autoFocus? onCancel? />"
          caption="Search-mode field with inline ×. Pass onCancel to expose the iOS-style Cancel link."
        >
          <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
            <SearchBar
              value={searchQ}
              onChangeText={setSearchQ}
              placeholder="Search transactions"
              onCancel={() => setSearchQ('')}
            />
            <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>
              Query: {searchQ || '—'}
            </Text>
          </View>
        </DevKitSection>

        {/* ── SearchableList ─────────────────────────────────────────── */}
        <DevKitSection
          title="SearchableList"
          aliases={['token picker', 'recipient picker', 'find list']}
          filter={filter}
          api="<SearchableList query onQueryChange items matches renderItem recents? onRecentPress? />"
          caption="SearchBar + recent chips + filtered list. Drop into a BottomSheet for a token picker."
        >
          <SearchableList
            query={tokenQ}
            onQueryChange={setTokenQ}
            placeholder="Search tokens"
            recents={['BTC', 'ETH', 'USDC']}
            onRecentPress={setTokenQ}
            items={[
              { sym: 'BTC',  name: 'Bitcoin',     bal: '0.42' },
              { sym: 'ETH',  name: 'Ethereum',    bal: '4.21' },
              { sym: 'SOL',  name: 'Solana',      bal: '120.5' },
              { sym: 'USDC', name: 'USD Coin',    bal: '5,200' },
              { sym: 'BORG', name: 'SwissBorg',   bal: '18,400' },
              { sym: 'ADA',  name: 'Cardano',     bal: '320' },
            ]}
            keyExtractor={t => t.sym}
            matches={(t, q) => {
              const ql = q.toLowerCase();
              return t.sym.toLowerCase().includes(ql) || t.name.toLowerCase().includes(ql);
            }}
            renderItem={(t, { last }) => (
              <ListRow
                leading={<CryptoIcon symbol={t.sym} size={36} />}
                primary={t.name}
                secondary={t.sym}
                value={t.bal}
                onPress={() => {}}
                last={last}
              />
            )}
          />
        </DevKitSection>

        {/* ── TransactionRow ─────────────────────────────────────────── */}
        <DevKitSection
          title="TransactionRow"
          aliases={['tx row', 'transaction', 'activity']}
          filter={filter}
          api="<TransactionRow kind primary secondary? value subValue? valueColor? receiptMatched? onPress? last? />"
          caption="Specialized ListRow — auto-masks money values via BalanceVisibilityContext."
        >
          <Card padding="rows">
            <TransactionRow
              kind="receive"
              primary="Received BTC"
              secondary="From Alice · 12:01"
              value="+0.024 BTC"
              subValue="≈ €1,040.00"
            />
            <TransactionRow
              kind="swap"
              primary="Swapped USDC → ETH"
              secondary="Today · 09:42"
              value="-1,200 USDC"
              subValue="≈ €1,200.00"
            />
            <TransactionRow
              kind="send"
              primary="Sent ETH"
              secondary="To 0xab…f4 · Yesterday"
              value="-0.05 ETH"
              subValue="≈ €260.00"
              receiptMatched
            />
            <TransactionRow
              kind="earn"
              primary="Earn yield"
              secondary="BTC vault · Oct 24"
              value="+0.0003 BTC"
              subValue="≈ €12.40"
              last
            />
          </Card>
        </DevKitSection>

        {/* ── DateGroupedList ────────────────────────────────────────── */}
        <DevKitSection
          title="DateGroupedList"
          aliases={['grouped list', 'date list', 'activity feed']}
          filter={filter}
          api="<DateGroupedList groups renderItem keyExtractor? cardPadding? />"
          caption="Generic over the row type. Pair with TransactionRow for activity feeds."
        >
          <DateGroupedList
            groups={[
              {
                label: 'Today',
                items: [
                  { id: 't1', kind: 'receive' as TxKind, primary: 'Received BTC',  secondary: '12:01', value: '+0.024 BTC', subValue: '≈ €1,040.00' },
                  { id: 't2', kind: 'swap'    as TxKind, primary: 'Swapped USDC',   secondary: '09:42', value: '-1,200 USDC', subValue: '≈ €1,200.00' },
                ],
              },
              {
                label: 'Yesterday',
                items: [
                  { id: 'y1', kind: 'send' as TxKind, primary: 'Sent ETH', secondary: '17:30', value: '-0.05 ETH', subValue: '≈ €260.00' },
                ],
              },
              {
                label: 'October 2025',
                items: [
                  { id: 'o1', kind: 'earn'     as TxKind, primary: 'Earn yield',   secondary: 'BTC vault', value: '+0.0003 BTC', subValue: '≈ €12.40' },
                  { id: 'o2', kind: 'withdraw' as TxKind, primary: 'Withdrew EUR', secondary: 'SEPA',      value: '-€500.00' },
                ],
              },
            ]}
            keyExtractor={t => t.id}
            renderItem={(t, { last }) => (
              <TransactionRow
                kind={t.kind}
                primary={t.primary}
                secondary={t.secondary}
                value={t.value}
                subValue={t.subValue}
                last={last}
              />
            )}
          />
        </DevKitSection>

        {/* ── StickyFilterBar ────────────────────────────────────────── */}
        <DevKitSection
          title="StickyFilterBar"
          aliases={['filter strip', 'filter bar']}
          filter={filter}
          api="<StickyFilterBar options=[{value,label}] active onChange blurred? />"
          caption="Horizontal FilterChip strip — wrap in a sticky/animated parent to pin under the title bar."
        >
          <View style={{ gap: SPACING.md }}>
            <StickyFilterBar
              options={[
                { value: 'all',      label: 'All' },
                { value: 'deposit',  label: 'Deposits' },
                { value: 'withdraw', label: 'Withdrawals' },
                { value: 'swap',     label: 'Swaps' },
                { value: 'earn',     label: 'Earn' },
                { value: 'send',     label: 'Sent' },
                { value: 'receive',  label: 'Received' },
              ]}
              active={txFilter}
              onChange={setTxFilter}
            />
            <Text style={[typography.label, { color: COLORS.foregroundMuted, paddingHorizontal: SPACING.xl }]}>
              Active: {txFilter}
            </Text>
          </View>
        </DevKitSection>

        {/* ── SettingsGroup ──────────────────────────────────────────── */}
        <DevKitSection
          title="SettingsGroup"
          aliases={['settings section', 'preferences', 'grouped list']}
          filter={filter}
          api="<SettingsGroup title? footnote?>{<ListRow ... />}</SettingsGroup>"
          caption="iOS-style grouped section. Pair with Switch in the trailing slot for toggle rows."
        >
          <SettingsGroup title="Notifications" footnote="You can change these anytime.">
            <ListRow
              leading={<IconCircle><Ionicons name="megaphone-outline" size={18} color={COLORS.foreground} /></IconCircle>}
              primary="Marketing"
              trailing={
                <Switch
                  value={settingsToggles.marketing}
                  onValueChange={v => setSettingsToggles(s => ({ ...s, marketing: v }))}
                />
              }
            />
            <ListRow
              leading={<IconCircle><Ionicons name="newspaper-outline" size={18} color={COLORS.foreground} /></IconCircle>}
              primary="Product news"
              trailing={
                <Switch
                  value={settingsToggles.productNews}
                  onValueChange={v => setSettingsToggles(s => ({ ...s, productNews: v }))}
                />
              }
              last
            />
          </SettingsGroup>
          <SettingsGroup title="Security">
            <ListRow
              leading={<IconCircle><Ionicons name="finger-print-outline" size={18} color={COLORS.foreground} /></IconCircle>}
              primary="Face ID / Touch ID"
              trailing={
                <Switch
                  value={settingsToggles.biometrics}
                  onValueChange={v => setSettingsToggles(s => ({ ...s, biometrics: v }))}
                />
              }
              last
            />
          </SettingsGroup>
        </DevKitSection>

        {/* ── RefreshScroll ──────────────────────────────────────────── */}
        <DevKitSection
          title="RefreshScroll"
          aliases={['pull to refresh', 'refresh control']}
          filter={filter}
          api="<RefreshScroll onRefresh>{children}</RefreshScroll>"
          caption="ScrollView with a kit-themed RefreshControl. Drop in for any pull-to-refresh surface."
        >
          <Card padding="none" style={{ height: 200, overflow: 'hidden' }}>
            <RefreshScroll
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: SPACING.lg }}
              onRefresh={async () => {
                await new Promise(r => setTimeout(r, 900));
                setRefreshTick(t => t + 1);
              }}
            >
              <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>Scroll up + pull to refresh</Text>
              <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: SPACING.xs }]}>
                Refreshes fired this session: {refreshTick}
              </Text>
              <View style={{ height: 280 }} />
              <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>
                Bottom of the scroll area.
              </Text>
            </RefreshScroll>
          </Card>
        </DevKitSection>

        {/* ── ActionSheet ────────────────────────────────────────────── */}
        <DevKitSection
          title="ActionSheet"
          aliases={['action menu', 'options sheet']}
          filter={filter}
          api="<ActionSheet visible title? description? items=[{label,icon?,onPress,destructive?}] onClose />"
          caption="Action menu (Share / Favourite / Report / Delete). Distinct from BottomSheet, which is an option picker."
        >
          <Card padding="all">
            <View style={{ gap: SPACING.sm }}>
              <Button label="Open action sheet" variant="secondary" onPress={() => setActionSheetOpen(true)} />
              {actionResult ? (
                <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>
                  Last action: {actionResult}
                </Text>
              ) : null}
            </View>
          </Card>
          <ActionSheet
            visible={actionSheetOpen}
            onClose={() => setActionSheetOpen(false)}
            title="Manage transaction"
            description="0x4a…b9c2 · 0.024 BTC received"
            items={[
              { label: 'Share receipt', icon: 'share-outline', onPress: () => setActionResult('Shared') },
              { label: 'Favourite',     icon: 'star-outline',  onPress: () => setActionResult('Favourited') },
              { label: 'Hide',          icon: 'eye-off-outline', onPress: () => setActionResult('Hidden') },
              { label: 'Report issue',  icon: 'flag-outline', destructive: true, onPress: () => setActionResult('Reported') },
            ]}
          />
        </DevKitSection>

        {/* ── Slider ─────────────────────────────────────────────────── */}
        <DevKitSection
          title="Slider"
          aliases={['range slider', 'slippage', 'fee slider']}
          filter={filter}
          api="<Slider value onChange min? max? step? tone? disabled? onChangeComplete? />"
          caption="Continuous or stepped slider. Pair with a labeled header for slippage / fee tuning."
        >
          <Card padding="all">
            <View style={{ gap: SPACING.lg }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: SPACING.sm,
                  }}
                >
                  <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>Slippage tolerance</Text>
                  <Text style={[typography.labelSemibold, { color: COLORS.foreground }]}>
                    {slippage.toFixed(1)}%
                  </Text>
                </View>
                <Slider
                  value={slippage}
                  onChange={setSlippage}
                  min={0}
                  max={5}
                  step={0.1}
                />
              </View>
              <View>
                <Text style={[typography.label, { color: COLORS.foregroundMuted, marginBottom: SPACING.sm }]}>
                  Warning tone — continuous
                </Text>
                <Slider value={0.7} onChange={() => {}} tone="warning" />
              </View>
              <View>
                <Text style={[typography.label, { color: COLORS.foregroundMuted, marginBottom: SPACING.sm }]}>
                  Disabled
                </Text>
                <Slider value={0.4} onChange={() => {}} disabled />
              </View>
            </View>
          </Card>
        </DevKitSection>

        {/* ── InfoTooltip ────────────────────────────────────────────── */}
        <DevKitSection
          title="InfoTooltip"
          aliases={['help', 'tooltip', 'info popover']}
          filter={filter}
          api="<InfoTooltip title? message size? iconColor? style? />"
          caption="Info (i) icon → bottom-sheet popover. Use next to regulated copy (APY, fees, holding periods)."
        >
          <Card padding="all">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.lg, flexWrap: 'wrap' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs + 2 }}>
                <Text style={[typography.body, { color: COLORS.foreground }]}>APY</Text>
                <InfoTooltip
                  title="What is APY?"
                  message="Annual percentage yield — the rate of return over a year, including compounding. Rates are variable and can change daily."
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs + 2 }}>
                <Text style={[typography.body, { color: COLORS.foreground }]}>Slippage</Text>
                <InfoTooltip
                  title="Slippage tolerance"
                  message="The maximum price change you'll accept between quote and execution. Higher slippage means your trade is more likely to fill, but at a worse rate."
                  iconColor={COLORS.accent}
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs + 2 }}>
                <Text style={[typography.body, { color: COLORS.foreground }]}>Holding period</Text>
                <InfoTooltip message="Funds are locked for the lock-up period and cannot be withdrawn early." />
              </View>
            </View>
          </Card>
        </DevKitSection>

        {/* ── CountrySelect ──────────────────────────────────────────── */}
        <DevKitSection
          title="CountrySelect"
          aliases={['country picker', 'phone code', 'dial code', 'flag']}
          filter={filter}
          api="<CountrySelect visible value? onChange onClose countries? title? />"
          caption="Searchable country picker with flag + dial code. Pass `visible` like BottomSheet."
        >
          <Card padding="all">
            <View style={{ gap: SPACING.sm }}>
              <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>Current selection</Text>
              <Pressable
                onPress={() => setCountryOpen(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: SPACING.md,
                  backgroundColor: COLORS.iconBg,
                  borderRadius: 12,
                  paddingVertical: SPACING.md,
                  paddingHorizontal: SPACING.md + 2,
                }}
              >
                {country ? (
                  <>
                    <Text style={{ fontSize: 22 }}>{country.flag}</Text>
                    <Text style={[typography.bodySemibold, { color: COLORS.foreground, flex: 1 }]}>
                      {country.name}
                    </Text>
                    <Text style={[typography.body, { color: COLORS.foregroundMuted }]}>{country.dial}</Text>
                    <Ionicons name="chevron-down" size={16} color={COLORS.foregroundMuted} />
                  </>
                ) : (
                  <Text style={[typography.body, { color: COLORS.foregroundMuted, flex: 1 }]}>
                    Choose a country
                  </Text>
                )}
              </Pressable>
            </View>
          </Card>
          <CountrySelect
            visible={countryOpen}
            value={country?.code}
            onChange={c => { setCountry(c); setCountryOpen(false); }}
            onClose={() => setCountryOpen(false)}
          />
        </DevKitSection>

        {/* ── CameraGuide ────────────────────────────────────────────── */}
        <DevKitSection
          title="CameraGuide"
          aliases={['selfie', 'face capture', 'kyc selfie']}
          filter={filter}
          api="<CameraGuide prompt? onCapture? captured? ctaLabel? />"
          caption="Mock-only selfie capture surface. Wire `onCapture` to advance the KYC step."
        >
          <CameraGuide
            captured={selfieCaptured}
            onCapture={() => setSelfieCaptured(c => !c)}
          />
        </DevKitSection>

        {/* ── DocumentScanFrame ──────────────────────────────────────── */}
        <DevKitSection
          title="DocumentScanFrame"
          aliases={['id scan', 'document capture', 'kyc id', 'passport']}
          filter={filter}
          api="<DocumentScanFrame prompt? onCapture? captured? ctaLabel? aspectRatio? />"
          caption="Mock-only ID/document capture. Corners are decorative — no real edge detection."
        >
          <DocumentScanFrame
            captured={docCaptured}
            onCapture={() => setDocCaptured(c => !c)}
          />
        </DevKitSection>

        {/* ── YieldCard ──────────────────────────────────────────────── */}
        <DevKitSection
          title="YieldCard"
          aliases={['earn card', 'staking card', 'product card', 'apy card']}
          filter={filter}
          api="<YieldCard title description? apy? apyLabel? illustration? progress? timeLeft? cta? featured? />"
          caption="Marketing card for Earn / staking / yield products. Composes Card + ProgressBar + Badge + Button."
        >
          <View style={{ gap: SPACING.md }}>
            <YieldCard
              title="USDC Vault"
              description="Stablecoin yield with weekly compounding"
              apy="5.2%"
              illustration={<GlassIcon name="vault" size={56} />}
              progress={{ value: 0.72, label: 'Capacity', trailingLabel: '72%' }}
              timeLeft="Closes in 3d 4h"
              cta={{ label: 'Deposit', onPress: () => {} }}
              featured
            />
            <YieldCard
              title="BTC Earn"
              description="Hold BTC, earn BORG rewards weekly"
              apy="3.1%"
              illustration={<GlassIcon name="piggyBank" size={56} />}
              cta={{ label: 'Learn more', onPress: () => {} }}
            />
            <YieldCard
              title="Solana Staking"
              apy="6.8%"
              apyLabel="APR"
              illustration={<GlassIcon name="seedling" size={56} />}
              progress={{ value: 0.92, label: 'Almost full', trailingLabel: '92%' }}
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
