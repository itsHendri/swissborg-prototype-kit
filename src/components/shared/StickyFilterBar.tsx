import { ScrollView, View } from 'react-native';
import { FilterChip } from './FilterChip';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Option = { value: string; label: string };

type Props = {
  options: Option[];
  active: string;
  onChange: (next: string) => void;
  /** Apply a subtle blurred background. Default: true. */
  blurred?: boolean;
};

/**
 * Horizontal `FilterChip` strip designed to pin under the title bar on
 * scroll. Renders inside an absolutely-positioned wrapper *by the
 * parent* — this component is just the row.
 *
 * Pair with `PageTitleBar` and a `position: 'sticky'` (web) or
 * `Animated` parent (native) wrapper. For most prototype scenarios,
 * dropping it inline above the list (without sticky behavior) is fine.
 *
 *   <StickyFilterBar
 *     options={[
 *       { value: 'all',      label: 'All' },
 *       { value: 'deposit',  label: 'Deposits' },
 *       { value: 'withdraw', label: 'Withdrawals' },
 *       { value: 'swap',     label: 'Swaps' },
 *     ]}
 *     active={filter}
 *     onChange={setFilter}
 *   />
 */
export function StickyFilterBar({ options, active, onChange, blurred = true }: Props) {
  return (
    <View
      style={{
        backgroundColor: blurred ? `${COLORS.background}EE` : 'transparent',
        paddingVertical: SPACING.sm,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SPACING.xl,
          gap: SPACING.sm,
        }}
      >
        {options.map(opt => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={opt.value === active}
            onPress={() => onChange(opt.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
