import { useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Text, View, type LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHaptic } from '../../hooks/useHaptic';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Tone = 'accent' | 'destructive';

type Props = {
  label: string;
  onConfirm: () => void;
  /** Label shown after a successful swipe. Default: 'Confirmed'. */
  confirmLabel?: string;
  /** Default: 'accent'. Use 'destructive' for irreversible actions. */
  tone?: Tone;
  disabled?: boolean;
};

const THUMB = 56;
const TRACK_H = 64;
const COMMIT_RATIO = 0.85;

/**
 * Drag-to-confirm CTA. Standard fintech pattern (Mercury, Wealthfront,
 * Swiggy, Wolt) — replaces a tap-to-pay button for high-stakes actions
 * where you want the user to commit intentionally.
 *
 *   <SwipeToConfirm
 *     label="Slide to send €120.50"
 *     onConfirm={submitTransfer}
 *   />
 *
 * Behavior:
 *   - Drag the thumb past 85% of the track to commit.
 *   - Releases before that snap back with a spring; commit fires
 *     `useHaptic('success')` and locks the thumb at the end.
 *   - `tone="destructive"` swaps the accent for the destructive red.
 *
 * The component is self-contained — it doesn't reset on its own. Reset
 * it by changing the `key` prop, or rerender after a screen change.
 */
export function SwipeToConfirm({
  label,
  onConfirm,
  confirmLabel = 'Confirmed',
  tone = 'accent',
  disabled = false,
}: Props) {
  const [trackW, setTrackW] = useState(0);
  const [completed, setCompleted] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const haptic = useHaptic();
  const color = tone === 'destructive' ? COLORS.destructive : COLORS.accent;
  const maxX = Math.max(0, trackW - THUMB);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled && !completed,
      onMoveShouldSetPanResponder: () => !disabled && !completed,
      onPanResponderMove: (_, g) => {
        const clamped = Math.max(0, Math.min(g.dx, maxX));
        translateX.setValue(clamped);
      },
      onPanResponderRelease: (_, g) => {
        const clamped = Math.max(0, Math.min(g.dx, maxX));
        if (maxX > 0 && clamped / maxX >= COMMIT_RATIO) {
          haptic('success');
          setCompleted(true);
          Animated.timing(translateX, {
            toValue: maxX,
            duration: 120,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }).start(() => onConfirm());
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            friction: 7,
            tension: 60,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          friction: 7,
          tension: 60,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  const onLayout = (e: LayoutChangeEvent) => setTrackW(e.nativeEvent.layout.width);

  // Fade the prompt out as the thumb advances; fade the completed label in.
  const promptOpacity = maxX > 0
    ? translateX.interpolate({ inputRange: [0, maxX * 0.5], outputRange: [1, 0], extrapolate: 'clamp' })
    : 1;
  const fillScale = maxX > 0
    ? translateX.interpolate({ inputRange: [0, maxX], outputRange: [0, 1], extrapolate: 'clamp' })
    : 0;

  return (
    <View
      onLayout={onLayout}
      style={{
        height: TRACK_H,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.surface,
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
        justifyContent: 'center',
      }}
    >
      {/* Accent fill underneath that grows as the thumb moves. */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0, bottom: 0, left: 0,
          right: 0,
          backgroundColor: `${color}33`,
          transform: [{ scaleX: fillScale }],
          transformOrigin: 'left center',
        }}
      />

      {/* Prompt label (fades as the thumb moves). */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0, right: 0,
          alignItems: 'center',
          opacity: completed ? 0 : promptOpacity,
        }}
      >
        <Text style={[typography.bodySemibold, { color: COLORS.foregroundMuted }]}>
          {label}
        </Text>
      </Animated.View>

      {/* Confirmed label (replaces prompt after success). */}
      {completed ? (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }}
        >
          <Text style={[typography.bodySemibold, { color }]}>{confirmLabel}</Text>
        </View>
      ) : null}

      {/* Thumb */}
      <Animated.View
        {...responder.panHandlers}
        style={{
          width: THUMB,
          height: THUMB,
          borderRadius: RADIUS.full,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: (TRACK_H - THUMB) / 2,
          transform: [{ translateX }],
        }}
      >
        <Ionicons
          name={completed ? 'checkmark' : 'arrow-forward'}
          size={24}
          color={COLORS.onAccent}
        />
      </Animated.View>
    </View>
  );
}
