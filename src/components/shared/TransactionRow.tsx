import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ListRow } from './ListRow';
import { IconCircle } from './IconCircle';
import { Badge } from './Badge';
import { useBalanceVisible, formatBalance } from '../../context/BalanceVisibilityContext';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type TxKind =
  | 'deposit'
  | 'withdraw'
  | 'swap'
  | 'send'
  | 'receive'
  | 'earn'
  | 'fee';

type Props = {
  kind: TxKind;
  /** Primary label — e.g. "Sent ETH", "Received from Alice". */
  primary: string;
  /** Secondary line — date, hash, party. */
  secondary?: string;
  /**
   * Signed money string ("+€120.50", "-0.05 ETH"). Sign drives color
   * automatically; pass `valueColor` to override.
   */
  value: string;
  /** Optional sub-amount line (e.g. local fiat conversion). */
  subValue?: string;
  /** Override the value color. */
  valueColor?: string;
  /** Show a "Receipt matched" chip (Mercury-style). */
  receiptMatched?: boolean;
  onPress?: () => void;
  /** Suppress the bottom divider — use for the last row in a card. */
  last?: boolean;
};

const KIND_SPEC: Record<TxKind, { icon: IconName }> = {
  deposit:  { icon: 'arrow-down-outline' },
  withdraw: { icon: 'arrow-up-outline' },
  swap:     { icon: 'swap-horizontal-outline' },
  send:     { icon: 'arrow-up-outline' },
  receive:  { icon: 'arrow-down-outline' },
  earn:     { icon: 'leaf-outline' },
  fee:      { icon: 'pricetag-outline' },
};

/**
 * Specialized list row for transaction history. Wraps `ListRow` with a
 * transaction-type icon, signed value colour, and an optional
 * receipt-matched chip. Money values are auto-masked when the global
 * BalanceVisibility eye is off.
 *
 *   <TransactionRow
 *     kind="receive"
 *     primary="Received BTC"
 *     secondary="From Alice · 12:01"
 *     value="+0.024 BTC"
 *     subValue="≈ €1,040.00"
 *   />
 */
export function TransactionRow({
  kind,
  primary,
  secondary,
  value,
  subValue,
  valueColor,
  receiptMatched,
  onPress,
  last,
}: Props) {
  const { visible } = useBalanceVisible();
  const trimmed = value.trim();
  const isCredit = trimmed.startsWith('+');
  const isDebit = trimmed.startsWith('-');
  const color = valueColor ?? (isCredit ? COLORS.accent : isDebit ? COLORS.foreground : COLORS.foreground);
  const maskedValue = formatBalance(value, visible);
  const maskedSub = subValue ? formatBalance(subValue, visible) : undefined;

  return (
    <ListRow
      leading={
        <IconCircle>
          <Ionicons name={KIND_SPEC[kind].icon} size={18} color={COLORS.foreground} />
        </IconCircle>
      }
      primary={primary}
      secondary={secondary}
      onPress={onPress}
      last={last}
      trailing={
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[typography.bodySemibold, { color }]} numberOfLines={1}>
            {maskedValue}
          </Text>
          {maskedSub ? (
            <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: 2 }]} numberOfLines={1}>
              {maskedSub}
            </Text>
          ) : null}
          {receiptMatched ? (
            <View style={{ marginTop: SPACING.xs + 2 }}>
              <Badge label="Receipt matched" tone="success" size="chip" />
            </View>
          ) : null}
        </View>
      }
    />
  );
}
