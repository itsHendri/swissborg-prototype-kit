/**
 * Big-number hero used at the top of portfolio / account / asset
 * screens.
 *
 *   <HeroBalance
 *     label="Total Balance"
 *     value="$22.14"
 *     change={{ amount: '+$2.57', percent: 6.23, period: '24H' }}
 *     onToggleVisibility   // optional — defaults to the global BalanceVisibilityContext
 *   />
 *
 * Composes:
 *   - `typography.displayLarge` value (auto-masked when balance is hidden)
 *   - `<PercentChange />` inline with the change amount
 *   - eye / eye-off toggle wired to `<BalanceVisibilityProvider />`
 *
 * Sized for the top of a screen (centered, full-width). For inline
 * uses, drop into a `<View style={{ alignItems: 'flex-start' }}>` wrapper.
 */

import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PercentChange } from './PercentChange';
import { useBalanceVisible, formatBalance } from '../../context/BalanceVisibilityContext';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Change = {
  /** Pre-formatted change in money terms (e.g. "+$2.57"). */
  amount?: string;
  /** Signed percent — feeds `<PercentChange />`. */
  percent: number;
  /** Optional period label (e.g. "24H", "Today", "1M"). */
  period?: string;
};

type Props = {
  /** Top label (e.g. "Total Balance", "Available", "Portfolio value"). */
  label?: string;
  /** Formatted balance string. Auto-masked via `BalanceVisibilityContext`. */
  value: string;
  /** Change indicator below the value. */
  change?: Change;
  /**
   * Render the eye toggle next to the label. Default: true if the
   * `<BalanceVisibilityProvider />` is mounted. Pass `false` to suppress.
   */
  showVisibilityToggle?: boolean;
  /** Horizontal alignment. Default: 'center'. */
  align?: 'center' | 'left';
};

export function HeroBalance({
  label,
  value,
  change,
  showVisibilityToggle = true,
  align = 'center',
}: Props) {
  const { visible, toggle } = useBalanceVisible();
  const alignItems = align === 'center' ? 'center' : 'flex-start';
  const masked = formatBalance(value, visible);

  return (
    <View style={{ alignItems, paddingHorizontal: SPACING.xl, gap: SPACING.xs }}>
      {label || showVisibilityToggle ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs + 2 }}>
          {label ? (
            <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>{label}</Text>
          ) : null}
          {showVisibilityToggle ? (
            <Pressable
              onPress={toggle}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={visible ? 'Hide balance' : 'Show balance'}
            >
              <Ionicons
                name={visible ? 'eye-outline' : 'eye-off-outline'}
                size={16}
                color={COLORS.foregroundMuted}
              />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <Text style={[typography.displayLarge, { color: COLORS.foreground }]}>
        {masked}
      </Text>

      {change ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.sm,
          }}
        >
          {change.amount ? (
            <Text
              style={[
                typography.bodySemibold,
                {
                  color: change.percent >= 0 ? COLORS.accent : COLORS.destructive,
                },
              ]}
            >
              {visible ? change.amount : formatBalance(change.amount, false)}
            </Text>
          ) : null}
          <PercentChange value={change.percent} variant="pill" />
          {change.period ? (
            <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>
              {change.period}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
