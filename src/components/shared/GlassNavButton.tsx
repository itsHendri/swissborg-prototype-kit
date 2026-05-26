import { TouchableOpacity, View, Text, Platform } from 'react-native';
import { BlurView, type BlurTint } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../constants/typography';

type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * Platform blur config
 *
 * iOS:  `systemUltraThinMaterialDark` → Apple UIVisualEffectView material (hardware vibrancy,
 *       true frosted glass, iOS 13+).
 *
 * Android: `experimentalBlurMethod="dimezisBlurView"` enables native blur via the Dimezis
 *   BlurView library (hardware-accelerated on Android 6+). Without it, expo-blur falls back
 *   to a semi-transparent scrim. Google Material 3 calls this pattern "Frosted surface".
 *   We enable it here; if you need to remove it for performance reasons set the prop to "none".
 */
export const GLASS_TINT:      BlurTint = Platform.OS === 'ios' ? 'systemUltraThinMaterialDark' : 'dark';
export const GLASS_INTENSITY:  number  = Platform.OS === 'ios' ? 60 : 80;

type Props = {
  /** Ionicons glyph. Omit and pass `children` for a custom glyph. */
  icon?: IconName;
  /** Custom glyph or content (overrides `icon`). */
  children?: ReactNode;
  /**
   * Optional label. When set, the button expands to a pill shape (height
   * = `size`, auto width with horizontal padding) with icon + label.
   */
  label?: string;
  onPress?: () => void;
  /** Diameter when iconic · height when labelled. Default: 36. */
  size?: number;
  /** Icon glyph size. Default: size * 0.5. */
  iconSize?: number;
  /** Icon colour. Default: `COLORS.foreground`. */
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
};

/**
 * Circular nav button with a frosted-glass blur background.
 *
 * - iOS: native `UIVisualEffectView` via expo-blur (`systemUltraThinMaterialDark`).
 * - Android 12+: hardware `RenderEffect` blur via expo-blur.
 * - Android <12: semi-transparent scrim fallback (expo-blur software mode).
 *
 * Drop-in replacement for any hand-rolled circular nav button.
 */
export function GlassNavButton({
  icon,
  children,
  label,
  onPress,
  size = 36,
  iconSize,
  iconColor = COLORS.foreground,
  style,
  activeOpacity = 0.7,
}: Props) {
  const radius = size / 2;
  const glyph  = iconSize ?? Math.round(size * 0.5);
  const isPill = Boolean(label);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={[
        isPill
          ? { height: size }
          : { width: size, height: size },
        style,
      ]}
    >
      <BlurView
        tint={GLASS_TINT}
        intensity={GLASS_INTENSITY}
        experimentalBlurMethod="dimezisBlurView"
        style={{
          height: size,
          ...(isPill ? { paddingHorizontal: SPACING.md, flexDirection: 'row', gap: SPACING.xs + 2 /* 6 */ } : { width: size }),
          borderRadius: radius,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Border ring — inside the clipping region so it isn't hidden by overflow:hidden */}
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: radius,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.18)',
          }}
        />
        {children ?? (icon ? (
          <Ionicons name={icon} size={glyph} color={iconColor} />
        ) : null)}
        {label ? (
          <Text style={[typography.labelBold, { color: iconColor }]}>{label}</Text>
        ) : null}
      </BlurView>
    </TouchableOpacity>
  );
}
