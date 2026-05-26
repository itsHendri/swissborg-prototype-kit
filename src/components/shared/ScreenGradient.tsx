import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

/**
 * A gradient fade placed directly below a sticky header.
 * Transitions from the app background (opaque) → transparent so scrolling
 * content softly disappears behind the header rather than hard-cutting.
 */
export function ScreenGradient({ height = 28 }: { height?: number }) {
  return (
    <LinearGradient
      colors={[COLORS.background, 'rgba(11,28,20,0)']}
      style={{ height }}
      pointerEvents="none"
    />
  );
}
