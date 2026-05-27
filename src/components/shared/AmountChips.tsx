import { Pressable, Text, View } from 'react-native';
import { useHaptic } from '../../hooks/useHaptic';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

export type AmountChipOption =
  | { label: string; value: string }
  | { label: string; custom: true };

type Props = {
  options: AmountChipOption[];
  /** The `value` of the active option, or `'__custom__'` if the custom chip is active. */
  active?: string;
  onSelect: (option: AmountChipOption) => void;
};

/**
 * Preset-amount chip row. Common in tipping, top-ups, suggested
 * deposits. Pair with `AmountInput` — tapping a preset fills the input,
 * tapping "Custom" focuses the field.
 *
 *   <AmountChips
 *     active={amount}
 *     onSelect={opt => 'value' in opt ? setAmount(opt.value) : focusField()}
 *     options={[
 *       { label: '€0',    value: '0' },
 *       { label: '€1',    value: '1' },
 *       { label: '€5',    value: '5' },
 *       { label: '€10',   value: '10' },
 *       { label: 'Custom', custom: true },
 *     ]}
 *   />
 */
export function AmountChips({ options, active, onSelect }: Props) {
  const haptic = useHaptic('selection');
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        paddingHorizontal: SPACING.xl,
      }}
    >
      {options.map(opt => {
        const isActive =
          'custom' in opt
            ? active === '__custom__'
            : opt.value === active;
        return (
          <Pressable
            key={opt.label}
            onPress={() => { haptic(); onSelect(opt); }}
            hitSlop={4}
            style={{
              paddingVertical: SPACING.sm + 2,
              paddingHorizontal: SPACING.md + 2,
              borderRadius: RADIUS.full,
              backgroundColor: isActive ? COLORS.accent : COLORS.surface,
              borderWidth: 1,
              borderColor: isActive ? COLORS.accent : 'rgba(255,255,255,0.06)',
            }}
          >
            <Text
              style={[
                typography.bodySemibold,
                { color: isActive ? COLORS.onAccent : COLORS.foreground },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
