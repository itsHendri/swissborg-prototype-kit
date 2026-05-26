import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

export type QuoteSide = {
  /** Top label (e.g. "You send"). */
  label: string;
  /** Headline amount (e.g. "1.00"). */
  amount: string;
  /** Asset symbol or currency code (e.g. "BTC", "USD"). */
  symbol: string;
  /** Secondary line under the amount (e.g. "≈ €45,200"). */
  secondary?: string;
};

export type QuoteMetaRow = {
  label: string;
  value: string;
  /** Override the value's color — useful for a green-accent best-rate hint. */
  valueColor?: string;
};

type Props = {
  /** Top half — typically "You send" or "From". */
  from: QuoteSide;
  /** Bottom half — typically "You get" or "To". */
  to: QuoteSide;
  /** Rate, fees, slippage, ETA. Stacked under a divider. */
  meta?: QuoteMetaRow[];
};

/**
 * Trade / swap / send confirmation summary. Two prominent sides with an
 * arrow in the divider, followed by a meta block.
 *
 *   <QuoteCard
 *     from={{ label: 'You send', amount: '0.50',  symbol: 'BTC', secondary: '≈ €22,600' }}
 *     to={{   label: 'You get',  amount: '4.21',  symbol: 'ETH', secondary: '≈ €22,520' }}
 *     meta={[
 *       { label: 'Rate',     value: '1 BTC = 8.42 ETH' },
 *       { label: 'Fee',      value: '€2.10' },
 *       { label: 'Slippage', value: '0.5%' },
 *     ]}
 *   />
 */
export function QuoteCard({ from, to, meta }: Props) {
  return (
    <Card padding="all">
      <Side side={from} />
      <Divider />
      <Side side={to} />
      {meta && meta.length > 0 ? (
        <View
          style={{
            marginTop: SPACING.lg,
            paddingTop: SPACING.md,
            borderTopWidth: 1,
            borderTopColor: COLORS.divider,
            gap: SPACING.sm,
          }}
        >
          {meta.map(row => (
            <View
              key={row.label}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>{row.label}</Text>
              <Text style={[typography.bodySemibold, { color: row.valueColor ?? COLORS.foreground }]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

function Side({ side }: { side: QuoteSide }) {
  return (
    <View>
      <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>{side.label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm, marginTop: SPACING.xs }}>
        <Text style={[typography.display, { color: COLORS.foreground }]}>{side.amount}</Text>
        <Text style={[typography.title, { color: COLORS.foregroundMuted }]}>{side.symbol}</Text>
      </View>
      {side.secondary ? (
        <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: 2 }]}>{side.secondary}</Text>
      ) : null}
    </View>
  );
}

function Divider() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginVertical: SPACING.md,
      }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: COLORS.divider }} />
      <View
        style={{
          width: 28, height: 28,
          borderRadius: 14,
          backgroundColor: COLORS.iconBg,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Ionicons name="arrow-down" size={14} color={COLORS.foreground} />
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: COLORS.divider }} />
    </View>
  );
}
