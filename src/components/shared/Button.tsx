import { TouchableOpacity, Text, View, type ViewStyle, type StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';
import { FONT_SIZE } from '../../constants/typography';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

type Props = {
  label: string;
  onPress: () => void;
  /** Default: 'md' */
  size?: ButtonSize;
  /** Default: 'primary' */
  variant?: ButtonVariant;
  leftIcon?: IconName;
  rightIcon?: IconName;
  disabled?: boolean;
  /** Stretch to fill parent width. Default: false. */
  fullWidth?: boolean;
  /**
   * Fully-rounded pill shape — overrides the size's default radius with
   * `RADIUS.full`. Use for compact inline actions like the Account ID
   * "Copy" row button.
   */
  pill?: boolean;
  /** Override text color (for e.g. secondary Sell button with accent text). */
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};

type SizeSpec = {
  height: number;
  radius: number;
  padH: number;
  fontSize: number;
  iconSize: number;
  gap: number;
};

const SIZES: Record<ButtonSize, SizeSpec> = {
  sm: { height: 32, radius: RADIUS.lg,   padH: SPACING.md, fontSize: FONT_SIZE.body,     iconSize: 14, gap: SPACING.xs + 2 },
  md: { height: 40, radius: RADIUS.card, padH: SPACING.lg, fontSize: FONT_SIZE.body,     iconSize: 16, gap: SPACING.sm },
  lg: { height: 48, radius: RADIUS.card, padH: SPACING.xl, fontSize: FONT_SIZE.subtitle, iconSize: 18, gap: SPACING.sm },
};

type VariantSpec = { bg: string; text: string; borderColor?: string };

const VARIANTS: Record<ButtonVariant, VariantSpec> = {
  primary:   { bg: COLORS.accent,      text: COLORS.onAccent },
  secondary: { bg: COLORS.surface,     text: COLORS.foreground, borderColor: 'rgba(255,255,255,0.08)' },
  ghost:     { bg: 'transparent',      text: COLORS.foregroundMuted },
  // Transparent fill with a visible accent stroke — the low-commitment CTA
  // used on compact hero empty states where the block sits next to denser
  // content (Portfolio per-account empty states, Home watchlist nudges).
  outline:   { bg: 'transparent',      text: COLORS.accent,     borderColor: COLORS.accent },
};

/**
 * Shared CTA button. Sizes follow the 8-point grid:
 *   sm = 32h r16 · md = 40h r12 · lg = 48h r12
 *
 * Use `primary` for brand CTAs, `secondary` for muted surface actions
 * (pair with `textColor={COLORS.accent}` for the Sell-style accent-on-surface
 * variant), `ghost` for low-emphasis text buttons.
 */
export function Button({
  label,
  onPress,
  size = 'md',
  variant = 'primary',
  leftIcon,
  rightIcon,
  disabled = false,
  fullWidth = false,
  pill = false,
  textColor,
  style,
}: Props) {
  const s = SIZES[size]    ?? SIZES.md;
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const color = textColor ?? v.text;
  const radius = pill ? RADIUS.full : s.radius;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        {
          height: s.height,
          borderRadius: radius,
          paddingHorizontal: s.padH,
          backgroundColor: v.bg,
          borderWidth: v.borderColor ? 1 : 0,
          borderColor: v.borderColor,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          ...(fullWidth && { width: '100%' }),
        },
        style,
      ]}
    >
      {leftIcon && (
        <View style={{ marginRight: s.gap }}>
          <Ionicons name={leftIcon} size={s.iconSize} color={color} />
        </View>
      )}
      <Text style={{ color, fontSize: s.fontSize, fontWeight: '700' }}>{label}</Text>
      {rightIcon && (
        <View style={{ marginLeft: s.gap }}>
          <Ionicons name={rightIcon} size={s.iconSize} color={color} />
        </View>
      )}
    </TouchableOpacity>
  );
}
