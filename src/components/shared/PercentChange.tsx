import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Props = {
  /** Signed percent value. e.g. 2.4 → "+2.40%"; -1.1 → "-1.10%"; 0 → "0.00%". */
  value: number;
  /**
   * Visual treatment.
   *   - `text` (default): inline colored text, optional arrow.
   *   - `pill`: tinted background pill (Badge-style).
   */
  variant?: 'text' | 'pill';
  /** Default: 'sm'. Affects font size in `text` variant. */
  size?: 'sm' | 'md';
  /** Show ▲/▼ arrow. Default: true. */
  arrow?: boolean;
  /** Decimal places. Default: 2. */
  precision?: number;
};

/**
 * Formatted percent-change indicator with directional color.
 *   positive → accent · negative → destructive · zero → muted
 *
 *   <PercentChange value={2.4} />                    // +2.40% ▲ (accent)
 *   <PercentChange value={-1.1} variant="pill" />    // pill, destructive tint
 *   <PercentChange value={0} arrow={false} />        // 0.00% (muted)
 */
export function PercentChange({
  value,
  variant = 'text',
  size = 'sm',
  arrow = true,
  precision = 2,
}: Props) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const color = isPositive
    ? COLORS.accent
    : isNegative
    ? COLORS.destructive
    : COLORS.foregroundMuted;
  const sign = isPositive ? '+' : '';
  const formatted = `${sign}${value.toFixed(precision)}%`;

  const arrowEl =
    arrow && (isPositive || isNegative) ? (
      <Ionicons
        name={isPositive ? 'caret-up' : 'caret-down'}
        size={size === 'md' ? 14 : 12}
        color={color}
      />
    ) : null;

  if (variant === 'pill') {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: `${color}22`,
          borderRadius: RADIUS.full,
          paddingVertical: 3,
          paddingHorizontal: SPACING.sm,
          alignSelf: 'flex-start',
        }}
      >
        {arrowEl}
        <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{formatted}</Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {arrowEl}
      <Text style={[size === 'md' ? typography.bodySemibold : typography.labelSemibold, { color }]}>
        {formatted}
      </Text>
    </View>
  );
}
