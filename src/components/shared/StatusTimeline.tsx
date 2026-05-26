import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

export type TimelineStep = {
  /** Headline (e.g. "Pending", "Sent"). */
  title: string;
  /** Secondary line (e.g. timestamp, hash, description). */
  detail?: string;
};

type Props = {
  steps: TimelineStep[];
  /** 0-indexed current step. Earlier steps render as done, later as upcoming. */
  current: number;
};

/**
 * Vertical status timeline. Each step is a circle + label + optional detail,
 * connected by a tinted rail. The active step is filled accent; done steps
 * show a checkmark; upcoming steps are muted.
 *
 *   <StatusTimeline
 *     current={1}
 *     steps={[
 *       { title: 'Sent',      detail: '12:01 · 0x4a…' },
 *       { title: 'Confirmed', detail: 'Waiting for finality' },
 *       { title: 'Settled' },
 *     ]}
 *   />
 */
export function StatusTimeline({ steps, current }: Props) {
  return (
    <View>
      {steps.map((step, idx) => {
        const isDone = idx < current;
        const isActive = idx === current;
        const isLast = idx === steps.length - 1;
        const color = isDone || isActive ? COLORS.accent : COLORS.foregroundMuted;
        return (
          <View key={`${step.title}-${idx}`} style={{ flexDirection: 'row', gap: SPACING.md }}>
            {/* Indicator column */}
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 22, height: 22,
                  borderRadius: RADIUS.full,
                  backgroundColor: isDone ? COLORS.accent : isActive ? `${COLORS.accent}33` : COLORS.surface,
                  borderWidth: isActive ? 2 : 0,
                  borderColor: COLORS.accent,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={12} color={COLORS.onAccent} />
                ) : isActive ? (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent }} />
                ) : null}
              </View>
              {!isLast ? (
                <View
                  style={{
                    flex: 1,
                    width: 2,
                    marginVertical: 4,
                    backgroundColor: isDone ? COLORS.accent : COLORS.divider,
                    borderRadius: 1,
                  }}
                />
              ) : null}
            </View>

            {/* Content column */}
            <View style={{ flex: 1, paddingBottom: isLast ? 0 : SPACING.lg }}>
              <Text style={[typography.bodySemibold, { color: isActive || isDone ? COLORS.foreground : COLORS.foregroundMuted }]}>
                {step.title}
              </Text>
              {step.detail ? (
                <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: 2 }]}>
                  {step.detail}
                </Text>
              ) : null}
              {/* Reserve color so future variants (warning rail, etc.) can shift it via prop. */}
              {color === COLORS.accent ? null : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
