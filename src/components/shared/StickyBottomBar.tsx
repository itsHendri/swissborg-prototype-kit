import { Fragment } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Children } from 'react';
import type { ReactNode } from 'react';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Props = {
  children: ReactNode;
  /** Horizontal padding. Default: 20 (AssetDetail-style). */
  paddingHorizontal?: number;
  /** Gap between children. Default: 12. */
  gap?: number;
  /** Background colour. Default: `COLORS.background`. */
  bg?: string;
  /**
   * Transparent bar — no background fill and no top border. Use on
   * SuccessScreen and other hero surfaces where the CTA floats over
   * ambient art (ShimmerGrid) rather than sitting on a divider.
   */
  transparent?: boolean;
  /** Optional style passthrough for rare positioning overrides. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Bottom-of-screen action bar (Buy / Sell / More, etc.).
 * Safe-area aware, 1px top border, screen-background tint.
 *
 * Layout rules:
 *   - **One child** (e.g. a single `fullWidth` Button): renders directly
 *     so the button's `width: '100%'` fills the bar.
 *   - **Multiple children**: each is wrapped in a `flex: 1` cell so
 *     buttons split the available width evenly. Callers can still pass
 *     `fullWidth` on each — it becomes 100% of its cell.
 *
 * Parent ScrollView should add `paddingBottom: ~120` to clear the bar.
 */
export function StickyBottomBar({
  children,
  paddingHorizontal = SPACING.xl,
  gap = SPACING.md,
  bg = COLORS.background,
  transparent = false,
  style,
}: Props) {
  const insets = useSafeAreaInsets();
  // Children.toArray normalises to a flat array with null/undefined/boolean
  // filtered out, so our "how many real children?" check is reliable even
  // when callers pass conditional chains like {a && <X />}{b && <Y />}.
  const kids = Children.toArray(children);
  const splitEvenly = kids.length > 1;

  return (
    <View
      style={[
        {
          paddingHorizontal,
          paddingTop: SPACING.md,
          paddingBottom: insets.bottom + SPACING.md,
          backgroundColor: transparent ? 'transparent' : bg,
          borderTopWidth: transparent ? 0 : 1,
          borderTopColor: transparent ? 'transparent' : COLORS.divider,
          flexDirection: 'row',
          gap,
        },
        style,
      ]}
    >
      {kids.map((child, i) =>
        splitEvenly ? (
          <View key={i} style={{ flex: 1 }}>
            {child}
          </View>
        ) : (
          <Fragment key={i}>{child}</Fragment>
        ),
      )}
    </View>
  );
}
