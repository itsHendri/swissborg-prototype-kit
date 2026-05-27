import { useMemo, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { SearchBar } from './SearchBar';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Props<T> = {
  /** Current search query. Controlled — owner holds the state. */
  query: string;
  onQueryChange: (next: string) => void;
  placeholder?: string;
  /** Recent / suggested queries shown when the field is empty. */
  recents?: string[];
  onRecentPress?: (recent: string) => void;
  /** The full data set. Filtering happens client-side via `matches`. */
  items: T[];
  /** Return true if the item should be shown for the given query. */
  matches: (item: T, query: string) => boolean;
  renderItem: (item: T, info: { index: number; last: boolean }) => ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  /** Fired when the user taps Cancel on the search bar. */
  onCancel?: () => void;
};

/**
 * Composite picker shell: `SearchBar` + recent-search chips + filtered
 * results. Designed for token pickers, recipient pickers, country/asset
 * selectors — anywhere you'd otherwise reach for `BottomSheet` + a
 * custom search field.
 *
 *   <SearchableList
 *     query={q}
 *     onQueryChange={setQ}
 *     placeholder="Search tokens"
 *     recents={['BTC', 'ETH', 'USDC']}
 *     onRecentPress={setQ}
 *     items={tokens}
 *     matches={(t, q) => t.symbol.toLowerCase().includes(q.toLowerCase())}
 *     renderItem={(t, { last }) => <TokenRow {...t} last={last} />}
 *   />
 */
export function SearchableList<T>({
  query,
  onQueryChange,
  placeholder,
  recents,
  onRecentPress,
  items,
  matches,
  renderItem,
  keyExtractor,
  onCancel,
}: Props<T>) {
  const filtered = useMemo(() => {
    const q = query.trim();
    if (q.length === 0) return items;
    return items.filter(it => matches(it, q));
  }, [items, query, matches]);

  return (
    <View style={{ gap: SPACING.md }}>
      <View style={{ paddingHorizontal: SPACING.xl }}>
        <SearchBar
          value={query}
          onChangeText={onQueryChange}
          placeholder={placeholder}
          onCancel={onCancel}
        />
      </View>

      {query.trim().length === 0 && recents && recents.length > 0 ? (
        <View style={{ paddingHorizontal: SPACING.xl }}>
          <Text
            style={{
              color: COLORS.foregroundMuted,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: SPACING.sm,
            }}
          >
            Recent
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
            {recents.map(r => (
              <Pressable
                key={r}
                onPress={() => onRecentPress?.(r)}
                hitSlop={4}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 6,
                  paddingHorizontal: SPACING.md,
                  borderRadius: 999,
                  backgroundColor: COLORS.surface,
                }}
              >
                <Ionicons name="time-outline" size={12} color={COLORS.foregroundMuted} />
                <Text style={[typography.label, { color: COLORS.foreground }]}>{r}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {filtered.length > 0 ? (
        <Card padding="rows">
          {filtered.map((item, idx) => {
            const last = idx === filtered.length - 1;
            const k = keyExtractor ? keyExtractor(item, idx) : String(idx);
            return (
              <View key={k}>{renderItem(item, { index: idx, last })}</View>
            );
          })}
        </Card>
      ) : (
        <View style={{ paddingHorizontal: SPACING.xl, paddingVertical: SPACING.lg, alignItems: 'center' }}>
          <Text style={[typography.body, { color: COLORS.foregroundMuted }]}>
            No matches for “{query.trim()}”.
          </Text>
        </View>
      )}
    </View>
  );
}
