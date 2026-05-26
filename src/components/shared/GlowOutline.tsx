import { View } from 'react-native';

/**
 * GlowOutline
 *
 * Three concentric inward-fading rings that simulate a light-source kiss on
 * an edge — the same bezel technique used on the NetWorthCard allocation bar,
 * the Profile Gold-rank bar, and the LTV gauge. Extracted so every "premium"
 * surface (featured cards, progress bars, tinted chips) can reach for a
 * single glow primitive instead of inlining the stack of three absolute Views.
 *
 * Usage:
 *   <View style={{ overflow: 'hidden', borderRadius: 12 }}>
 *     {children}
 *     <GlowOutline radius={12} />
 *   </View>
 *
 * Radius should match the parent's `borderRadius`; the inner rings inset by
 * 1 and 2 px and reduce their own radius so each ring reads as a parallel
 * stroke rather than a rounded-rectangle jag.
 */
type Props = {
  /** Outer border radius — pass the parent's corner radius. */
  radius: number;
};

export function GlowOutline({ radius }: Props) {
  return (
    <>
      {/* Outer stroke — a soft 0.5 px highlight catching the top edge. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: radius,
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.28)',
        }}
      />
      {/* Inner bleed — 1 px inward, gentler secondary line. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 1, left: 1, right: 1, bottom: 1,
          borderRadius: Math.max(0, radius - 1),
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.09)',
        }}
      />
      {/* Outer bleed — 2 px inward, fades to a near-invisible third line. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 2, left: 2, right: 2, bottom: 2,
          borderRadius: Math.max(0, radius - 2),
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.04)',
        }}
      />
    </>
  );
}
