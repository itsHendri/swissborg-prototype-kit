import { View, Platform, StyleSheet, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { RADIUS } from '../../constants/ui';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { GlowOutline } from './GlowOutline';

/**
 * Featured-card accent glow — the purple wash that emanates from the
 * bottom-right of every `variant="featured"` card. Kept as module-level
 * constants so the banner, the styles-screen preview, and any future
 * featured surface all share one value.
 *
 * Rendered as a diagonal `LinearGradient` from the top-left (transparent)
 * to the bottom-right (opaque purple) with an intermediate midpoint — the
 * effect reads as a soft corner glow while avoiding the clipping /
 * edge-artefact issues that react-native-svg radial gradients exhibit at
 * odd aspect ratios.
 */
const FEATURED_GLOW_COLOR = '#7869FF';
// Stops concentrate the purple in the bottom-right corner only. The
// first ~55% of the diagonal is fully transparent so the card's left
// two-thirds keep the clean dark surface tone; the glow then rises
// quickly in the final 30% so it reads as an accent emanating from the
// corner rather than a diagonal wash across the whole card.
const FEATURED_GLOW_STOPS: [string, string, string] = [
  'rgba(120,105,255,0)',     // far end — transparent
  'rgba(120,105,255,0.35)',  // corner wash starts fading in
  'rgba(120,105,255,0.95)',  // bottom-right corner — opaque purple source
];
const FEATURED_GLOW_LOCATIONS: [number, number, number] = [0.55, 0.85, 1];

type Variant = 'surface' | 'featured';
type Padding = 'rows' | 'all' | 'none';

type Props = ViewProps & {
  children: ReactNode;
  /**
   * Surface tint.
   *   - `surface` (default): `COLORS.surface` — airy, flat card.
   *   - `featured`:          Dark `COLORS.surfaceDeep` base with a purple
   *                          diagonal accent glow emanating from the
   *                          bottom-right corner, a three-ring bezel glow
   *                          (via `<GlowOutline />`), and a soft elevation
   *                          shadow. Use for hero / marketing content
   *                          (portfolio summary, upsell, premium CTAs).
   */
  variant?: Variant;
  /**
   * Padding preset:
   *   - `rows` (default): horizontal only — rhythm comes from list rows inside.
   *   - `all`: horizontal + vertical (16).
   *   - `none`: no inner padding.
   */
  padding?: Padding;
  /** Suppress the default 20px screen-edge margin. Default: false. */
  noMargin?: boolean;
  style?: StyleProp<ViewStyle>;
};

const BG: Record<Variant, string> = {
  surface:  COLORS.surface,
  featured: COLORS.surfaceDeep,
};

/**
 * Standard card container. Background + radius + padding follow the
 * design-system rules (radius 12, surface tint, no shadow on flat surfaces).
 *
 * The `featured` variant is the premium treatment — reserved for surfaces
 * that should feel elevated and inviting (hero dashboards, marketing cards,
 * single-action promos). It layers a bottom-right purple accent glow over
 * the darker `surfaceDeep` tone plus a three-ring bezel glow and a
 * low-spread iOS shadow / Android elevation so the card lifts subtly off
 * the page. The marketing banner and every future featured card pull
 * straight from this one variant — they stay visually tied by construction.
 */
export function Card({
  children,
  variant = 'surface',
  padding = 'rows',
  noMargin = false,
  style,
  ...rest
}: Props) {
  const paddingStyle =
    padding === 'all'  ? { padding: SPACING.lg } :
    padding === 'rows' ? { paddingHorizontal: SPACING.lg } :
                         null;

  const isFeatured = variant === 'featured';

  // Featured cards need the shadow drawn *outside* the clipped corner mask,
  // so we nest: outer wrapper owns the shadow + margin, inner view owns the
  // fill, padding, rounded mask, the accent glow, and the bezel outline.
  if (isFeatured) {
    return (
      <View
        style={[
          {
            marginHorizontal: noMargin ? 0 : SPACING.xl,
            borderRadius: RADIUS.card,
          },
          PREMIUM_SHADOW,
        ]}
      >
        <View
          {...rest}
          style={[
            {
              backgroundColor: BG.featured,
              borderRadius: RADIUS.card,
              overflow: 'hidden',
            },
            paddingStyle,
            style,
          ]}
        >
          {/* Purple accent glow — diagonal fade from the transparent
              top-left to the opaque bottom-right. Fills the entire card
              with no clipping so the banner's hero art and the preview
              card read with the same wash. */}
          <LinearGradient
            colors={FEATURED_GLOW_STOPS}
            locations={FEATURED_GLOW_LOCATIONS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          {children}
          <GlowOutline radius={RADIUS.card} />
        </View>
      </View>
    );
  }

  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: BG.surface,
          borderRadius: RADIUS.card,
          marginHorizontal: noMargin ? 0 : SPACING.xl,
        },
        paddingStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

// iOS soft elevation + Android shadowElevation. The shadow is intentionally
// low-spread — a premium card should lift, not float. Colour stays black so
// the lift reads against both the page background and any ambient ShimmerGrid.
const PREMIUM_SHADOW: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  android: {
    elevation: 6,
  },
  default: {},
})!;

// Keep the accent colour reachable for callers that want to theme adjacent
// elements (e.g. a matching legend dot on the bar underneath the hero).
export const FEATURED_ACCENT = FEATURED_GLOW_COLOR;
