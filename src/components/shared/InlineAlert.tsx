import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type IconName = ComponentProps<typeof Ionicons>['name'];
export type InlineAlertTone = 'info' | 'success' | 'warning' | 'danger';

type Props = {
  tone?: InlineAlertTone;
  title?: string;
  /** Body copy. Required unless `title` is set. */
  message?: string;
  /** Tap-to-act affordance on the right (e.g. "Review", "Fix"). */
  action?: { label: string; onPress: () => void };
  /** Show an × on the right that calls `onDismiss`. */
  onDismiss?: () => void;
  /** Override the leading icon. Defaults follow the tone. */
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

const TONE_SPEC: Record<InlineAlertTone, { bg: string; border: string; fg: string; icon: IconName }> = {
  info:    { bg: `${COLORS.info}22`,        border: COLORS.info,        fg: COLORS.foreground, icon: 'information-circle' },
  success: { bg: `${COLORS.accent}22`,      border: COLORS.accent,      fg: COLORS.foreground, icon: 'checkmark-circle' },
  warning: { bg: `${COLORS.warning}22`,     border: COLORS.warning,     fg: COLORS.foreground, icon: 'warning' },
  danger:  { bg: `${COLORS.destructive}22`, border: COLORS.destructive, fg: COLORS.foreground, icon: 'alert-circle' },
};

/**
 * Sticky, contextual in-screen banner. Distinct from `Toast` — Toast is
 * ephemeral (dismisses itself); InlineAlert is anchored to its place in
 * the layout and stays until the user dismisses it or the condition
 * resolves.
 *
 * Use for: LTV warnings, KYC pending notices, slippage too-high hints,
 * security advisories.
 *
 *   <InlineAlert
 *     tone="warning"
 *     title="LTV is approaching the limit"
 *     message="At 80% your position may be liquidated."
 *     action={{ label: 'Add collateral', onPress: navigate }}
 *   />
 */
export function InlineAlert({
  tone = 'info',
  title,
  message,
  action,
  onDismiss,
  icon,
  style,
}: Props) {
  const spec = TONE_SPEC[tone];
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: SPACING.md,
          backgroundColor: spec.bg,
          borderRadius: RADIUS.card,
          borderLeftWidth: 3,
          borderLeftColor: spec.border,
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.md + 2,
        },
        style,
      ]}
    >
      <Ionicons name={icon ?? spec.icon} size={20} color={spec.border} style={{ marginTop: 1 }} />
      <View style={{ flex: 1, gap: 2 }}>
        {title ? (
          <Text style={[typography.bodySemibold, { color: spec.fg }]}>{title}</Text>
        ) : null}
        {message ? (
          <Text style={[typography.label, { color: COLORS.foregroundMuted }]}>{message}</Text>
        ) : null}
        {action ? (
          <Pressable onPress={action.onPress} hitSlop={6} style={{ marginTop: SPACING.xs + 2 }}>
            <Text style={[typography.labelSemibold, { color: spec.border }]}>
              {action.label} →
            </Text>
          </Pressable>
        ) : null}
      </View>
      {onDismiss ? (
        <Pressable onPress={onDismiss} hitSlop={8}>
          <Ionicons name="close" size={16} color={COLORS.foregroundMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}
