import { Text, View } from 'react-native';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Props = {
  /** 1-indexed current step. Clamped to [1, total]. */
  current: number;
  total: number;
  /** Optional per-step labels. Length must match `total` to render. */
  labels?: string[];
  /** Visual density. `compact` is a slim bar with the "Step N of M" caption. */
  variant?: 'numbered' | 'compact';
};

/**
 * Horizontal numbered progress for multi-step flows (onboarding, KYC,
 * confirm wizards). Distinct from `PagerDots` — `Stepper` is labeled and
 * intended for sequenced state.
 *
 *   <Stepper current={2} total={4} />
 *   <Stepper current={2} total={4} labels={['Verify', 'Fund', 'Review', 'Done']} />
 */
export function Stepper({ current, total, labels, variant = 'numbered' }: Props) {
  const clamped = Math.max(1, Math.min(current, total));

  if (variant === 'compact') {
    const pct = clamped / total;
    return (
      <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.sm }}>
        <View
          style={{
            height: 4,
            backgroundColor: COLORS.surface,
            borderRadius: RADIUS.full,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${pct * 100}%`,
              height: '100%',
              backgroundColor: COLORS.accent,
              borderRadius: RADIUS.full,
            }}
          />
        </View>
        <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>
          Step {clamped} of {total}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: SPACING.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
        {Array.from({ length: total }).map((_, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < clamped;
          const isActive = stepNum === clamped;
          const fg = isDone || isActive ? COLORS.accent : COLORS.foregroundMuted;
          const bg = isDone
            ? COLORS.accent
            : isActive
            ? `${COLORS.accent}33`
            : COLORS.surface;
          return (
            <View key={stepNum} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: RADIUS.full,
                  backgroundColor: bg,
                  borderWidth: isActive ? 1 : 0,
                  borderColor: COLORS.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: isDone ? COLORS.onAccent : fg,
                    fontSize: 11,
                    fontWeight: '700',
                  }}
                >
                  {stepNum}
                </Text>
              </View>
              {i < total - 1 ? (
                <View
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: stepNum < clamped ? COLORS.accent : COLORS.divider,
                    marginHorizontal: SPACING.xs,
                    borderRadius: RADIUS.full,
                  }}
                />
              ) : null}
            </View>
          );
        })}
      </View>
      {labels && labels.length === total ? (
        <View style={{ flexDirection: 'row', marginTop: SPACING.sm }}>
          {labels.map((label, i) => (
            <Text
              key={label + i}
              numberOfLines={1}
              style={[
                typography.label,
                {
                  flex: 1,
                  color: i + 1 === clamped ? COLORS.foreground : COLORS.foregroundMuted,
                  textAlign: i === 0 ? 'left' : i === labels.length - 1 ? 'right' : 'center',
                },
              ]}
            >
              {label}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
