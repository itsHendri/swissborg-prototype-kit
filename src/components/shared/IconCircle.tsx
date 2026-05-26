import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { COLORS } from '../../constants/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type IconCircleSize = 'sm' | 'md' | 'lg';

type Props = {
  /** Ionicons glyph name. Omit and pass `children` to use a different icon set. */
  icon?: IconName;
  /** Custom glyph (e.g. MaterialCommunityIcons) — rendered centered inside the circle. */
  children?: ReactNode;
  /**
   * Size preset. Default: `md` (36 px circle, 18 px glyph — list-row standard).
   * `sm` = 28 / 14 — inline chips.
   * `lg` = 44 / 22 — emphasized actions (sparingly).
   */
  size?: IconCircleSize;
  /** Background colour. Default: `COLORS.iconBg`. */
  bg?: string;
  /** Icon colour. Default: `COLORS.foreground`. */
  color?: string;
};

const SIZES: Record<IconCircleSize, { d: number; g: number }> = {
  sm: { d: 28, g: 14 },
  md: { d: 36, g: 18 },
  lg: { d: 44, g: 22 },
};

/**
 * Shared circular icon chip used on list rows, menu rows, and action items.
 * Default matches the list-row spec: 36×36, `COLORS.iconBg`, 18px white icon.
 *
 * Pass `icon` for Ionicons or `children` for any other glyph component. The
 * three `size` presets (`sm` / `md` / `lg`) are the only sizes the system
 * ships — request a new one via the design system before hand-rolling.
 */
export function IconCircle({
  icon,
  children,
  size = 'md',
  bg = COLORS.iconBg,
  color = COLORS.foreground,
}: Props) {
  const { d, g } = SIZES[size];
  return (
    <View
      style={{
        width: d,
        height: d,
        borderRadius: d / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children ?? (icon ? (
        <Ionicons name={icon} size={g} color={color} />
      ) : null)}
    </View>
  );
}
