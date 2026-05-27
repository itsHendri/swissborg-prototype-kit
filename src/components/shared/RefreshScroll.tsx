import { useCallback, useState, type ReactNode } from 'react';
import { RefreshControl, ScrollView, type ScrollViewProps } from 'react-native';
import { useHaptic } from '../../hooks/useHaptic';
import { COLORS } from '../../constants/colors';

type Props = Omit<ScrollViewProps, 'refreshControl'> & {
  /**
   * Called when the user pulls to refresh. Return a Promise (or sync
   * value) — the spinner stays visible until it resolves.
   */
  onRefresh: () => unknown | Promise<unknown>;
  children: ReactNode;
};

/**
 * Themed `ScrollView` with a `<RefreshControl />` styled in the kit's
 * accent. Pull down to trigger; releases fire a `selection` haptic.
 *
 * Drop-in replacement for `ScrollView` on any screen that benefits from
 * pull-to-refresh — portfolio, transactions, market list, watchlist.
 *
 *   <RefreshScroll
 *     onRefresh={async () => { await fetchLatest(); }}
 *     contentContainerStyle={{ paddingBottom: SPACING['4xl'] }}
 *   >
 *     <HeroBalance ... />
 *     <ListRow ... />
 *   </RefreshScroll>
 */
export function RefreshScroll({ onRefresh, children, ...scroll }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const haptic = useHaptic('selection');

  const handle = useCallback(async () => {
    haptic();
    setRefreshing(true);
    try {
      await Promise.resolve(onRefresh());
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, haptic]);

  return (
    <ScrollView
      {...scroll}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handle}
          tintColor={COLORS.accent}
          colors={[COLORS.accent]}
          progressBackgroundColor={COLORS.surface}
        />
      }
    >
      {children}
    </ScrollView>
  );
}
