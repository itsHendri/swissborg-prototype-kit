import { Text, View } from 'react-native';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

export type ProgressTone = 'accent' | 'warning' | 'destructive' | 'info';
export type ProgressSize = 'sm' | 'md' | 'lg';

type Props = {
  /** Progress as a 0–1 ratio. Values outside the range are clamped. */
  value: number;
  /** Default: 'accent'. */
  tone?: ProgressTone;
  /** Bar thickness. sm=2 · md=4 (default) · lg=8. */
  size?: ProgressSize;
  /** Optional label rendered above the bar (e.g. "Onboarding · 2 of 4"). */
  label?: string;
  /** Optional trailing value rendered to the right of the label (e.g. "65%"). */
  trailingLabel?: string;
};

const HEIGHTS: Record<ProgressSize, number> = { sm: 2, md: 4, lg: 8 };

const TONES: Record<ProgressTone, string> = {
  accent:      COLORS.accent,
  warning:     COLORS.warning,
  destructive: COLORS.destructive,
  info:        COLORS.info,
};

/**
 * Linear determinate progress bar. Use for KYC steps, staking lockups,
 * onboarding funnels, transaction confirmations.
 *
 *   <ProgressBar value={0.65} label="Onboarding" trailingLabel="2 of 4" />
 *   <ProgressBar value={0.85} tone="warning" size="lg" />
 */
export function ProgressBar({
  value,
  tone = 'accent',
  size = 'md',
  label,
  trailingLabel,
}: Props) {
  const clamped = Math.max(0, Math.min(1, value));
  const height = HEIGHTS[size];
  const color = TONES[tone];

  return (
    <View>
      {(label || trailingLabel) ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: SPACING.xs + 2 /* 6 */,
          }}
        >
          {label ? (
            <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>{label}</Text>
          ) : <View />}
          {trailingLabel ? (
            <Text style={[typography.labelSemibold, { color: COLORS.foreground }]}>
              {trailingLabel}
            </Text>
          ) : null}
        </View>
      ) : null}
      <View
        style={{
          height,
          backgroundColor: COLORS.surface,
          borderRadius: RADIUS.full,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${clamped * 100}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: RADIUS.full,
          }}
        />
      </View>
    </View>
  );
}
