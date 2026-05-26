import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Props = {
  value: string;
  onChangeText: (next: string) => void;
  /** Symbol shown on the leading side (e.g. "$", "€", "BTC"). */
  symbol: string;
  /** Place the symbol before or after the amount. Default: 'leading'. */
  symbolPosition?: 'leading' | 'trailing';
  /** Helper line shown beneath — e.g. "≈ €0.045 ETH" or "Balance: 3.14 ETH". */
  helper?: string;
  /** Optional "Max" button on the right (e.g. wallet max-out). */
  onMax?: () => void;
  /** Optional toggle button — swap fiat ↔ crypto. */
  onToggleCurrency?: () => void;
  /** Visual error tint + helper text. */
  error?: string;
  placeholder?: string;
};

/**
 * Hero amount input for trade / swap / deposit / withdraw screens.
 *
 * Renders an oversized numeric field (display weight) with leading or
 * trailing currency symbol, an optional Max button, and an optional
 * fiat ↔ crypto toggle. Conversion / balance copy goes in `helper`.
 *
 *   <AmountInput
 *     value={amount}
 *     onChangeText={setAmount}
 *     symbol="$"
 *     helper="≈ 0.0421 BTC"
 *     onMax={handleMax}
 *     onToggleCurrency={swapCurrency}
 *   />
 */
export function AmountInput({
  value,
  onChangeText,
  symbol,
  symbolPosition = 'leading',
  helper,
  onMax,
  onToggleCurrency,
  error,
  placeholder = '0',
}: Props) {
  const hasError = Boolean(error);

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: SPACING.sm,
          backgroundColor: COLORS.surface,
          borderRadius: RADIUS.card,
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md + 2,
          borderWidth: 1,
          borderColor: hasError ? COLORS.destructive : 'transparent',
        }}
      >
        {symbolPosition === 'leading' ? (
          <Text style={[typography.display, { color: COLORS.foregroundMuted }]}>{symbol}</Text>
        ) : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          keyboardType="decimal-pad"
          style={[
            typography.display,
            { flex: 1, color: COLORS.foreground, padding: 0 },
          ]}
        />
        {symbolPosition === 'trailing' ? (
          <Text style={[typography.display, { color: COLORS.foregroundMuted }]}>{symbol}</Text>
        ) : null}
        {onToggleCurrency ? (
          <Pressable
            onPress={onToggleCurrency}
            hitSlop={8}
            style={{
              width: 36, height: 36, borderRadius: RADIUS.full,
              backgroundColor: COLORS.iconBg,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="swap-vertical" size={18} color={COLORS.foreground} />
          </Pressable>
        ) : null}
        {onMax ? (
          <Pressable
            onPress={onMax}
            hitSlop={8}
            style={{
              borderRadius: RADIUS.full,
              backgroundColor: COLORS.iconBg,
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.xs + 2,
            }}
          >
            <Text style={{ color: COLORS.accent, fontSize: 12, fontWeight: '700' }}>MAX</Text>
          </Pressable>
        ) : null}
      </View>
      {(hasError || helper) ? (
        <Text
          style={[
            typography.label,
            {
              color: hasError ? COLORS.destructive : COLORS.foregroundMuted,
              marginTop: SPACING.sm,
            },
          ]}
        >
          {error ?? helper}
        </Text>
      ) : null}
    </View>
  );
}
