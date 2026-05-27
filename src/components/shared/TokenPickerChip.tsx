import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CryptoIcon } from './CryptoIcon';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Props = {
  /** Crypto symbol — feeds `CryptoIcon`. */
  symbol: string;
  /**
   * Opens the picker. Wire to a `BottomSheet` with the token list.
   * Omit on the trailing side of a fixed pair where switching isn't allowed.
   */
  onPress?: () => void;
  /** Default: 'md'. */
  size?: 'sm' | 'md';
};

/**
 * Embeddable token chip: `[icon · SYMBOL · ▾]`. Drops into the leading or
 * trailing slot of an `AmountInput`, or into a `SwapPanel` row.
 *
 *   <AmountInput
 *     value={amount}
 *     onChangeText={setAmount}
 *     symbolPosition="trailing"
 *     symbol=""
 *     trailing={<TokenPickerChip symbol="ETH" onPress={openTokenSheet} />}
 *   />
 *
 * For now `AmountInput` only takes a string symbol — pair this chip
 * alongside, in a wrapping View. The chip itself is symbol-agnostic so
 * it works wherever you need an inline token target.
 */
export function TokenPickerChip({ symbol, onPress, size = 'md' }: Props) {
  const iconSize = size === 'sm' ? 20 : 24;
  const text = size === 'sm' ? typography.labelSemibold : typography.bodySemibold;
  const padV = size === 'sm' ? SPACING.xs + 2 : SPACING.sm;
  const padH = size === 'sm' ? SPACING.sm + 2 : SPACING.md;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={6}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs + 2,
        paddingVertical: padV,
        paddingHorizontal: padH,
        backgroundColor: COLORS.iconBg,
        borderRadius: RADIUS.full,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <CryptoIcon symbol={symbol} size={iconSize} />
      <Text style={[text, { color: COLORS.foreground }]}>{symbol}</Text>
      {onPress ? (
        <Ionicons name="chevron-down" size={14} color={COLORS.foregroundMuted} />
      ) : null}
      {!onPress ? <View style={{ width: 2 }} /> : null}
    </Pressable>
  );
}
