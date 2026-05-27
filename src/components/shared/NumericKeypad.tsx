import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHaptic } from '../../hooks/useHaptic';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Props = {
  value: string;
  onChange: (next: string) => void;
  /** Cap the input length (e.g. 12 for a sane amount field). */
  maxLength?: number;
  /** Hide the decimal-point key when set to false. Default: true. */
  allowDecimal?: boolean;
  /** Disable everything (e.g. while a quote loads). */
  disabled?: boolean;
};

/**
 * In-app 3×4 numeric keypad — replaces the system keyboard on
 * full-screen amount entry. Universal in crypto wallets (MoonPay,
 * Uniswap, Coinbase Wallet, Solflare).
 *
 *   const [amount, setAmount] = useState('');
 *   <AmountInput value={amount} onChangeText={() => {}} symbol="$" />
 *   <NumericKeypad value={amount} onChange={setAmount} />
 *
 * Behavior:
 *   - Digit taps append. Leading '0' is replaced (so "0" → tap "5" = "5", not "05").
 *   - '.' is appended only if not already present and the value is non-empty.
 *   - ⌫ removes the last character.
 *   - `selection` haptic on every tap, `impactLight` on backspace.
 */
export function NumericKeypad({
  value,
  onChange,
  maxLength = 12,
  allowDecimal = true,
  disabled = false,
}: Props) {
  const haptic = useHaptic();

  const tapDigit = (d: string) => {
    if (disabled) return;
    haptic('selection');
    if (value.length >= maxLength) return;
    // Replace a sole leading zero unless the user is mid-decimal ("0.").
    if (value === '0') return onChange(d);
    onChange(value + d);
  };

  const tapDecimal = () => {
    if (disabled || !allowDecimal) return;
    haptic('selection');
    if (value.includes('.')) return;
    if (value.length >= maxLength) return;
    onChange(value === '' ? '0.' : value + '.');
  };

  const tapBackspace = () => {
    if (disabled) return;
    haptic('impactLight');
    if (value === '') return;
    onChange(value.slice(0, -1));
  };

  const longPressBackspace = () => {
    if (disabled) return;
    haptic('impactMedium');
    onChange('');
  };

  return (
    <View
      style={{
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm + 2,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {[
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
      ].map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: SPACING.sm + 2 }}>
          {row.map(d => (
            <Key key={d} label={d} onPress={() => tapDigit(d)} />
          ))}
        </View>
      ))}
      <View style={{ flexDirection: 'row', gap: SPACING.sm + 2 }}>
        {allowDecimal ? (
          <Key label="." onPress={tapDecimal} />
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <Key label="0" onPress={() => tapDigit('0')} />
        <Key
          onPress={tapBackspace}
          onLongPress={longPressBackspace}
          accessibilityLabel="Backspace"
        >
          <Ionicons name="backspace-outline" size={22} color={COLORS.foreground} />
        </Key>
      </View>
    </View>
  );
}

function Key({
  label,
  onPress,
  onLongPress,
  accessibilityLabel,
  children,
}: {
  label?: string;
  onPress: () => void;
  onLongPress?: () => void;
  accessibilityLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => ({
        flex: 1,
        height: 56,
        borderRadius: RADIUS.lg,
        backgroundColor: pressed ? COLORS.iconBg : COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      {children ?? (
        <Text style={[typography.titleLarge, { color: COLORS.foreground }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
