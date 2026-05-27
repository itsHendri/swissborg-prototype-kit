import { Pressable, Text, View } from 'react-native';
import { useHaptic } from '../../hooks/useHaptic';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

/**
 * Canonical crypto-app time range pill row: `1H · 1D · 1W · 1M · 1Y · All`.
 *
 * Distinct from `TabSwitcher`:
 *   - Denser (32h, no underline rail).
 *   - Accent-on-active fill, muted-text inactive.
 *   - Pure value-out — does not own routing or screen state.
 *
 *   const [range, setRange] = useState<Range>('1D');
 *   <TimeRangePicker ranges={['1H','1D','1W','1M','1Y','All']} value={range} onChange={setRange} />
 */
export const DEFAULT_TIME_RANGES = ['1H', '1D', '1W', '1M', '1Y', 'All'] as const;
export type DefaultRange = typeof DEFAULT_TIME_RANGES[number];

type Props<T extends string> = {
  ranges: readonly T[];
  value: T;
  onChange: (next: T) => void;
  /** Default: 'md' — 32h pill. 'sm' is 24h for ultra-dense rows. */
  size?: 'sm' | 'md';
};

export function TimeRangePicker<T extends string>({
  ranges,
  value,
  onChange,
  size = 'md',
}: Props<T>) {
  const haptic = useHaptic('selection');
  const h = size === 'sm' ? 24 : 32;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.xl,
        gap: SPACING.xs,
      }}
    >
      {ranges.map(r => {
        const active = r === value;
        return (
          <Pressable
            key={r}
            onPress={() => { if (!active) { haptic(); onChange(r); } }}
            hitSlop={6}
            style={{
              flex: 1,
              height: h,
              borderRadius: RADIUS.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active ? COLORS.accent : 'transparent',
              borderWidth: active ? 0 : 1,
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <Text
              style={[
                typography.labelSemibold,
                { color: active ? COLORS.onAccent : COLORS.foregroundMuted },
              ]}
            >
              {r}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
