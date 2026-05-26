import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';
import { FONT_SIZE } from '../../constants/typography';

type Props<T extends string> = {
  tabs: readonly T[];
  active: T;
  onChange: (tab: T) => void;
  /** Wrap tabs in a horizontal ScrollView (use for 4+ tabs or narrow devices). Default: false. */
  scrollable?: boolean;
  /** Smaller horizontal padding on each pill. Default: false (matches Marketplace sizing). */
  compact?: boolean;
  /** Override horizontal padding of the outer row. Default: 20. */
  paddingHorizontal?: number;
  /** Override top spacing. Default: 0. */
  paddingTop?: number;
  /** Override bottom spacing. Default: 0. */
  paddingBottom?: number;
  /** Optional display labels (parallel to `tabs`). Defaults to the tab key itself. */
  labels?: readonly string[];
};

/**
 * Shared pill-style tab switcher. Active state uses the neutral-active
 * treatment from the design system (`COLORS.iconBg` bg + 12% white border +
 * foreground text). Brand green is never used for selection.
 *
 * Used by: SwapScreen (Trade / Limits / Trigger / Auto-Invest),
 * MarketplaceScreen (All / Watchlist / Crypto / Bundles),
 * PortfolioScreen (Activity / Holdings).
 */
export function TabSwitcher<T extends string>({
  tabs,
  active,
  onChange,
  scrollable = false,
  compact = false,
  paddingHorizontal = SPACING.xl,
  paddingTop = 0,
  paddingBottom = 0,
  labels,
}: Props<T>) {
  const pillPadH = compact ? SPACING.md + 2 /* 14 */ : SPACING.xl;

  const pills = tabs.map((tab, i) => (
    <TouchableOpacity
      key={tab}
      onPress={() => onChange(tab)}
      activeOpacity={0.7}
      style={{
        paddingVertical: SPACING.sm,
        paddingHorizontal: pillPadH,
        borderRadius: RADIUS.pill,
        backgroundColor: active === tab ? COLORS.iconBg : COLORS.surface,
        borderWidth: 1,
        borderColor: active === tab ? COLORS.selectionBorder : 'transparent',
      }}
    >
      <Text
        style={{
          fontSize: FONT_SIZE.body,
          fontWeight: '600',
          color: active === tab ? COLORS.foreground : COLORS.foregroundMuted,
        }}
      >
        {labels?.[i] ?? tab}
      </Text>
    </TouchableOpacity>
  ));

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal, gap: SPACING.sm, paddingTop, paddingBottom }}
      >
        {pills}
      </ScrollView>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal,
        gap: SPACING.sm,
        paddingTop,
        paddingBottom,
      }}
    >
      {pills}
    </View>
  );
}
