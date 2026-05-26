import { View, type StyleProp, type ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Props = {
  count: number;
  activeIndex: number;
  /** Active dot colour. Default: `COLORS.foreground`. */
  activeColor?: string;
  /** Inactive dot colour. Default: `rgba(255,255,255,0.2)`. */
  inactiveColor?: string;
  /** Top margin above the row. Default: 12. */
  marginTop?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Animated-looking dot indicator row for paged content.
 * Active dot is 16×6, inactive dots are 6×6 — per the design-system pager-dot spec.
 */
export function PagerDots({
  count,
  activeIndex,
  activeColor = COLORS.foreground,
  inactiveColor = 'rgba(255,255,255,0.2)',
  marginTop = SPACING.md,
  style,
}: Props) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop,
          gap: SPACING.xs + 2 /* 6 */,
        },
        style,
      ]}
    >
      {Array.from({ length: count }).map((_, i) => {
        const active = i === activeIndex;
        return (
          <View
            key={i}
            style={{
              width: active ? 16 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: active ? activeColor : inactiveColor,
            }}
          />
        );
      })}
    </View>
  );
}
