/**
 * Time-series line chart for portfolio / market / asset-detail screens.
 *
 * Two variants:
 *   - `sparkline` — minimal path with optional area fill, no axes, no
 *     interaction. For inline list rows, hero cards, dense grids.
 *   - `interactive` (default) — full-width chart with touch-driven
 *     crosshair + value readout. Emits `onPointerChange(point | null)`
 *     so the parent can render its own value/date header.
 *
 * Data can be passed as either a flat `number[]` (auto x-index) or
 * `{x, y}[]`. The chart auto-scales y to [min..max] of the data;
 * pass an explicit `domain` prop to lock the range (e.g. when
 * switching time ranges and you want the y axis to stay stable).
 *
 *   <LineChart data={prices} height={120} />
 *   <LineChart
 *     variant="sparkline"
 *     data={[100, 102, 99, 104, 110]}
 *     tone="accent"
 *     height={40}
 *     area
 *   />
 *   <LineChart
 *     data={prices}
 *     height={160}
 *     onPointerChange={p => setHover(p)}
 *   />
 */

import { useMemo, useRef, useState } from 'react';
import { PanResponder, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { COLORS } from '../../constants/colors';

export type LinePoint = { x: number; y: number };

export type LineChartTone = 'accent' | 'destructive' | 'warning' | 'info' | 'foreground';

type Props = {
  /** `number[]` → auto x = index. `LinePoint[]` → explicit. */
  data: number[] | LinePoint[];
  /** Default: 'interactive'. */
  variant?: 'sparkline' | 'interactive';
  /** Total height in pt. Default: 160. */
  height?: number;
  /** Width override. Defaults to filling the parent (via onLayout). */
  width?: number;
  /** Stroke + dot color. Default: 'accent'. */
  tone?: LineChartTone;
  /** Stroke thickness. Default: 2. */
  strokeWidth?: number;
  /** Render a translucent area below the line. Default: false. */
  area?: boolean;
  /** Lock the y range. Otherwise computed from data min/max with padding. */
  domain?: { min: number; max: number };
  /** Fired with the hovered point on interactive variants, or `null` on release. */
  onPointerChange?: (point: LinePoint | null) => void;
};

const TONE_COLOR: Record<LineChartTone, string> = {
  accent:      COLORS.accent,
  destructive: COLORS.destructive,
  warning:     COLORS.warning,
  info:        COLORS.info,
  foreground:  COLORS.foreground,
};

function toPoints(data: number[] | LinePoint[]): LinePoint[] {
  if (data.length === 0) return [];
  if (typeof data[0] === 'number') {
    return (data as number[]).map((y, x) => ({ x, y }));
  }
  return data as LinePoint[];
}

export function LineChart({
  data,
  variant = 'interactive',
  height = 160,
  width: widthProp,
  tone = 'accent',
  strokeWidth = 2,
  area = false,
  domain,
  onPointerChange,
}: Props) {
  const points = useMemo(() => toPoints(data), [data]);
  const [measuredW, setMeasuredW] = useState(widthProp ?? 0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const W = widthProp ?? measuredW;
  const H = height;
  const color = TONE_COLOR[tone];
  const gradId = useMemo(() => `lc-grad-${Math.random().toString(36).slice(2)}`, []);

  // Y range — explicit domain wins, otherwise auto with 6% padding.
  const { yMin, yMax } = useMemo(() => {
    if (domain) return { yMin: domain.min, yMax: domain.max };
    if (points.length === 0) return { yMin: 0, yMax: 1 };
    let mn = points[0].y, mx = points[0].y;
    for (const p of points) { if (p.y < mn) mn = p.y; if (p.y > mx) mx = p.y; }
    const span = mx - mn || 1;
    return { yMin: mn - span * 0.06, yMax: mx + span * 0.06 };
  }, [points, domain]);

  // X range from the data itself (handles non-uniform x as well as 0..N-1).
  const { xMin, xMax } = useMemo(() => {
    if (points.length === 0) return { xMin: 0, xMax: 1 };
    let mn = points[0].x, mx = points[0].x;
    for (const p of points) { if (p.x < mn) mn = p.x; if (p.x > mx) mx = p.x; }
    if (mn === mx) mx = mn + 1;
    return { xMin: mn, xMax: mx };
  }, [points]);

  const PAD_X = 1; // keep the path from clipping at the very edges
  const sx = (xv: number) => PAD_X + ((xv - xMin) / (xMax - xMin)) * (W - PAD_X * 2);
  const sy = (yv: number) => H - ((yv - yMin) / (yMax - yMin)) * H;

  const pathD = useMemo(() => {
    if (points.length === 0 || W === 0) return '';
    let d = `M ${sx(points[0].x).toFixed(2)} ${sy(points[0].y).toFixed(2)}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${sx(points[i].x).toFixed(2)} ${sy(points[i].y).toFixed(2)}`;
    }
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, W, H, yMin, yMax, xMin, xMax]);

  const areaD = useMemo(() => {
    if (!area || !pathD || W === 0) return '';
    return `${pathD} L ${sx(points[points.length - 1].x).toFixed(2)} ${H} L ${sx(points[0].x).toFixed(2)} ${H} Z`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathD, area, points, W, H]);

  const handleMove = (locationX: number) => {
    if (variant !== 'interactive' || points.length === 0 || W === 0) return;
    // Find nearest point by x.
    const dataX = xMin + (locationX / W) * (xMax - xMin);
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < points.length; i++) {
      const d = Math.abs(points[i].x - dataX);
      if (d < best) { best = d; nearest = i; }
    }
    if (nearest !== hoverIdx) {
      setHoverIdx(nearest);
      onPointerChange?.(points[nearest]);
    }
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => variant === 'interactive',
      onMoveShouldSetPanResponder: () => variant === 'interactive',
      onPanResponderGrant: (_, g) => handleMove(g.x0 - (g.x0 - g.dx)),
      onPanResponderMove: (_, g) => handleMove(g.moveX - (g.moveX - g.dx)),
      onPanResponderRelease: () => {
        setHoverIdx(null);
        onPointerChange?.(null);
      },
      onPanResponderTerminate: () => {
        setHoverIdx(null);
        onPointerChange?.(null);
      },
    }),
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    if (!widthProp) setMeasuredW(e.nativeEvent.layout.width);
  };

  const hoverPt = hoverIdx != null ? points[hoverIdx] : null;

  return (
    <View
      onLayout={onLayout}
      {...(variant === 'interactive' ? responder.panHandlers : {})}
      style={{ width: widthProp ?? '100%', height: H }}
    >
      {W > 0 && points.length > 0 ? (
        <Svg width={W} height={H}>
          {area ? (
            <Defs>
              <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0"   stopColor={color} stopOpacity={0.28} />
                <Stop offset="1"   stopColor={color} stopOpacity={0} />
              </LinearGradient>
            </Defs>
          ) : null}
          {area ? <Path d={areaD} fill={`url(#${gradId})`} /> : null}
          <Path d={pathD} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
          {hoverPt ? (
            <>
              <Line
                x1={sx(hoverPt.x)}
                x2={sx(hoverPt.x)}
                y1={0}
                y2={H}
                stroke={COLORS.foregroundMuted}
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.6}
              />
              <Circle
                cx={sx(hoverPt.x)}
                cy={sy(hoverPt.y)}
                r={5}
                fill={color}
                stroke={COLORS.background}
                strokeWidth={2}
              />
            </>
          ) : null}
        </Svg>
      ) : null}
    </View>
  );
}
