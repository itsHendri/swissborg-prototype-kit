/**
 * ShimmerGrid
 *
 * Ambient dot-grid background. A single SVG `<Pattern>` tiles 1 px accent-green
 * dots on a 10 px grid at low opacity. `pointerEvents="none"` so it never
 * intercepts touches — place it as the first child of a full-screen container.
 *
 * Intentionally static: the animated version (three drifting `<RadialGradient>`
 * glow blobs driven by six `Animated.loop`s + three `setInterval`s at 20 fps)
 * was a perf hotspot on mid-range devices and inside Dev Kit previews that
 * mounted multiple instances. The static texture reads as the same brand
 * surface without the per-frame JS/SVG composite cost.
 */
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle } from 'react-native-svg';
import { COLORS } from '../../constants/colors';

const { width: W, height: H } = Dimensions.get('window');

const DOT_GAP = 7;   // dot every 7 px (tighter)
const DOT_R   = 0.6; // sub-pixel dots for finer texture

export function ShimmerGrid() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={W} height={H}>
        <Defs>
          <Pattern
            id="dots"
            x="0"
            y="0"
            width={DOT_GAP}
            height={DOT_GAP}
            patternUnits="userSpaceOnUse"
          >
            <Circle cx={DOT_R} cy={DOT_R} r={DOT_R} fill={COLORS.accent} />
          </Pattern>
        </Defs>

        <Rect width={W} height={H} fill="url(#dots)" opacity={0.1} />
      </Svg>
    </View>
  );
}
