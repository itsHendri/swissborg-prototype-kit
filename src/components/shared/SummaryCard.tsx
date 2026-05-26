import { View, Text } from 'react-native';
import { Card } from './Card';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

export type SummaryRow = {
  label: string;
  value: string;
  /** Override value colour — defaults to `COLORS.foreground`. Accepts any COLORS token or raw hex. */
  valueColor?: string;
  /** Secondary label shown under the value (right-aligned). */
  sublabel?: string;
  /**
   * Optional "before" value — when present, renders as
   * `~valueFrom~ → value` so the caller can surface deltas (e.g. LTV
   * before vs. after a repayment or collateral top-up).
   */
  valueFrom?: string;
};

type Props = {
  rows: SummaryRow[];
  /** Optional footnote rendered under the rows (muted). */
  footnote?: string;
};

/**
 * Generic label/value detail card.
 *
 * Used for borrow confirms, repay confirms, add-collateral summaries,
 * loan details, order summaries — anywhere you want a vertically-stacked
 * list of label (muted) → value (emphasis) rows with dividers between.
 *
 * Always rendered inside a parent with horizontal padding — the card
 * itself uses `noMargin` so it sits flush with surrounding content.
 */
export function SummaryCard({ rows, footnote }: Props) {
  return (
    <View>
      <Card padding="rows" noMargin style={{ paddingVertical: SPACING.xs + 2 /* 6 */ }}>
        {rows.map((row, i) => {
          const last = i === rows.length - 1;
          return (
            <View
              key={row.label}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                paddingVertical: 10,
                borderBottomWidth: last ? 0 : 1,
                borderBottomColor: COLORS.divider,
              }}
            >
              <Text style={[typography.body, { color: COLORS.foregroundMuted }]}>{row.label}</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[typography.bodySemibold, { color: row.valueColor ?? COLORS.foreground }]}>
                  {row.valueFrom ? (
                    <>
                      <Text style={{ color: COLORS.foregroundMuted, textDecorationLine: 'line-through' }}>
                        {row.valueFrom}
                      </Text>
                      <Text style={{ color: COLORS.foregroundMuted }}>{'  →  '}</Text>
                    </>
                  ) : null}
                  {row.value}
                </Text>
                {row.sublabel ? (
                  <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: 2 }]}>
                    {row.sublabel}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </Card>
      {footnote ? (
        <Text
          style={[
            typography.label,
            { color: COLORS.foregroundMuted, marginTop: SPACING.md },
          ]}
        >
          {footnote}
        </Text>
      ) : null}
    </View>
  );
}
