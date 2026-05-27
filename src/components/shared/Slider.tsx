import { useRef, useState } from 'react';
import { PanResponder, View, type LayoutChangeEvent } from 'react-native';
import { useHaptic } from '../../hooks/useHaptic';
import { COLORS } from '../../constants/colors';
import { RADIUS } from '../../constants/ui';

export type SliderTone = 'accent' | 'destructive' | 'warning';

type Props = {
  value: number;
  onChange: (next: number) => void;
  /** Default: 0. */
  min?: number;
  /** Default: 1. */
  max?: number;
  /** Snap increment. 0 (default) = continuous. */
  step?: number;
  /** Default: 'accent'. */
  tone?: SliderTone;
  disabled?: boolean;
  /** Fires once when the user releases the thumb. Use for haptic / commit. */
  onChangeComplete?: (final: number) => void;
};

const THUMB = 24;
const TRACK = 4;

const TONES: Record<SliderTone, string> = {
  accent:      COLORS.accent,
  destructive: COLORS.destructive,
  warning:     COLORS.warning,
};

/**
 * Continuous or stepped slider with a draggable thumb. No external
 * dependency — uses `PanResponder` + raw layout math, identical pattern
 * to `SwipeToConfirm`.
 *
 *   const [slippage, setSlippage] = useState(0.5);
 *   <Slider
 *     value={slippage}
 *     onChange={setSlippage}
 *     min={0} max={5} step={0.1}
 *     onChangeComplete={() => haptic('selection')}
 *   />
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0,
  tone = 'accent',
  disabled = false,
  onChangeComplete,
}: Props) {
  const [width, setWidth] = useState(0);
  const dragStartRef = useRef(0);
  const haptic = useHaptic();
  const color = TONES[tone];
  const range = max - min;
  const usableW = Math.max(0, width - THUMB);
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const snap = (v: number) => (step > 0 ? Math.round(v / step) * step : v);

  const ratio = range === 0 ? 0 : (clamp(value) - min) / range;
  const thumbX = ratio * usableW;

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        dragStartRef.current = thumbX;
      },
      onPanResponderMove: (_, g) => {
        const x = Math.max(0, Math.min(dragStartRef.current + g.dx, usableW));
        const next = clamp(snap(min + (x / usableW) * range));
        if (next !== value) onChange(next);
      },
      onPanResponderRelease: () => {
        onChangeComplete?.(value);
        if (!onChangeComplete) haptic('selection');
      },
      onPanResponderTerminate: () => {
        onChangeComplete?.(value);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ).current;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      {...responder.panHandlers}
      style={{
        height: THUMB,
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {/* Track */}
      <View
        style={{
          position: 'absolute',
          left: 0, right: 0,
          height: TRACK,
          borderRadius: RADIUS.full,
          backgroundColor: COLORS.surface,
        }}
      />
      {/* Filled portion */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          width: thumbX + THUMB / 2,
          height: TRACK,
          borderRadius: RADIUS.full,
          backgroundColor: color,
        }}
      />
      {/* Thumb */}
      <View
        style={{
          position: 'absolute',
          left: thumbX,
          width: THUMB,
          height: THUMB,
          borderRadius: THUMB / 2,
          backgroundColor: COLORS.foreground,
          borderWidth: 2,
          borderColor: color,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
          elevation: 2,
        }}
      />
    </View>
  );
}
