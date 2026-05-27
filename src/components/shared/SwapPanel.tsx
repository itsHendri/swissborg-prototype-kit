import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TokenPickerChip } from './TokenPickerChip';
import { Card } from './Card';
import { useHaptic } from '../../hooks/useHaptic';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

export type SwapSide = {
  /** Label shown above the amount ("You send" / "You get"). */
  label: string;
  symbol: string;
  amount: string;
  /** Optional balance / converted-value caption below the amount row. */
  caption?: string;
  /** Fires when the user types into the amount field. Omit for read-only sides. */
  onAmountChange?: (next: string) => void;
  /** Opens the token picker. Omit if the side has a fixed token. */
  onTokenPress?: () => void;
};

type Props = {
  from: SwapSide;
  to: SwapSide;
  /** Reverse the From/To direction. Fires a `selection` haptic. */
  onSwapDirection?: () => void;
};

/**
 * The two-card swap input. Each card has its own token chip + amount
 * field; the center button reverses direction.
 *
 * Distinct from `QuoteCard` — `SwapPanel` is for *input* (amounts being
 * typed); `QuoteCard` is the read-only confirmation summary.
 *
 *   <SwapPanel
 *     from={{ label: 'You send', symbol: 'BTC', amount, onAmountChange: setAmount, onTokenPress: openFrom, caption: 'Balance: 0.42 BTC' }}
 *     to={{   label: 'You get',  symbol: 'ETH', amount: quote, caption: '≈ €22,520', onTokenPress: openTo }}
 *     onSwapDirection={reverse}
 *   />
 *
 * Pair with `NumericKeypad` below for full-screen entry, or rely on the
 * system keyboard.
 */
export function SwapPanel({ from, to, onSwapDirection }: Props) {
  const haptic = useHaptic('selection');

  return (
    <View>
      <Side side={from} />
      <View
        style={{
          alignItems: 'center',
          marginVertical: -16,
          zIndex: 1,
        }}
      >
        <Pressable
          onPress={() => { if (onSwapDirection) { haptic(); onSwapDirection(); } }}
          disabled={!onSwapDirection}
          hitSlop={8}
          style={({ pressed }) => ({
            width: 40, height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.iconBg,
            borderWidth: 3,
            borderColor: COLORS.background,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Ionicons name="swap-vertical" size={18} color={COLORS.foreground} />
        </Pressable>
      </View>
      <Side side={to} />
    </View>
  );
}

function Side({ side }: { side: SwapSide }) {
  return (
    <Card padding="all">
      <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>{side.label}</Text>
      <View
        style={{
          marginTop: SPACING.sm,
          flexDirection: 'row',
          alignItems: 'center',
          gap: SPACING.sm,
        }}
      >
        <TextInput
          value={side.amount}
          onChangeText={side.onAmountChange}
          editable={Boolean(side.onAmountChange)}
          placeholder="0"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="decimal-pad"
          style={[
            typography.display,
            {
              flex: 1,
              color: COLORS.foreground,
              padding: 0,
              // RN-Web focus ring removal
              ...(({ outlineWidth: 0 } as unknown) as Record<string, unknown>),
            },
          ]}
        />
        <TokenPickerChip symbol={side.symbol} onPress={side.onTokenPress} />
      </View>
      {side.caption ? (
        <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: SPACING.sm }]}>
          {side.caption}
        </Text>
      ) : null}
    </Card>
  );
}
