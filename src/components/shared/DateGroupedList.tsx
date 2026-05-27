import { Fragment, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Card } from './Card';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

export type DateGroup<T> = {
  /** Header label — e.g. "Today", "Yesterday", "October 2025". */
  label: string;
  items: T[];
};

type Props<T> = {
  groups: DateGroup<T>[];
  /**
   * Render a single item. The component is responsible for passing
   * `last` to the underlying row to suppress the trailing divider.
   */
  renderItem: (item: T, info: { index: number; last: boolean }) => ReactNode;
  /** React `key` for each item. Falls back to the array index. */
  keyExtractor?: (item: T, index: number) => string;
  /** Padding shape of the wrapping `Card`. Default: 'rows'. */
  cardPadding?: 'rows' | 'none' | 'all';
};

/**
 * Render a list grouped by date. Use for transaction history, activity
 * feeds, notification logs — anywhere rows benefit from a sticky-feeling
 * date header above each cluster.
 *
 * `groups` and `renderItem` are intentionally generic — pair with the
 * row component of your choice (`TransactionRow`, `ListRow`, or
 * something custom).
 *
 *   <DateGroupedList
 *     groups={[
 *       { label: 'Today', items: todayTx },
 *       { label: 'Yesterday', items: yesterdayTx },
 *       { label: 'October 2025', items: octoberTx },
 *     ]}
 *     renderItem={(tx, { last }) => (
 *       <TransactionRow {...tx} last={last} />
 *     )}
 *     keyExtractor={(tx) => tx.id}
 *   />
 */
export function DateGroupedList<T>({
  groups,
  renderItem,
  keyExtractor,
  cardPadding = 'rows',
}: Props<T>) {
  return (
    <View>
      {groups.map((g, gi) => (
        <Fragment key={`${g.label}-${gi}`}>
          <Text
            style={{
              color: COLORS.foregroundMuted,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              paddingHorizontal: SPACING.xl,
              paddingTop: gi === 0 ? SPACING.sm : SPACING.lg,
              paddingBottom: SPACING.sm,
            }}
          >
            {g.label}
          </Text>
          <Card padding={cardPadding}>
            {g.items.map((item, idx) => {
              const last = idx === g.items.length - 1;
              const k = keyExtractor ? keyExtractor(item, idx) : String(idx);
              return <Fragment key={k}>{renderItem(item, { index: idx, last })}</Fragment>;
            })}
          </Card>
        </Fragment>
      ))}
      {groups.length === 0 ? (
        <Text
          style={[
            typography.label,
            { color: COLORS.foregroundMuted, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.xl },
          ]}
        >
          No items to show.
        </Text>
      ) : null}
    </View>
  );
}
