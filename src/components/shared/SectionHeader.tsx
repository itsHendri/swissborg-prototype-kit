import { View, Text, TouchableOpacity } from 'react-native';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Props = {
  title: string;
  /** Right-aligned action label (e.g. "See all"). */
  actionLabel?: string;
  /** Action tap handler. */
  onAction?: () => void;
  /** Colour for the action label. Default accent green. */
  actionColor?: string;
  /**
   * Top spacing above the header. Default: 28 (SPACING['3xl'] - 4) — baked in
   * so every section gets an honest gap from whatever content precedes it.
   * Override only when the header sits directly under a page-title bar or
   * another header that already provides its own breathing room.
   */
  paddingTop?: number;
  /** Bottom spacing below the header. Default: 12. */
  marginBottom?: number;
  /** Horizontal inset. Default: 20 (screen edge). */
  marginHorizontal?: number;
};

/**
 * Screen-level section header — title on the left, optional action on the right.
 * Sits OUTSIDE card containers per the design system; cards take horizontal
 * padding only.
 *
 * Usage:
 *   <SectionHeader title="Action items" actionLabel="See all" onAction={...} />
 */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
  actionColor = COLORS.accent,
  paddingTop = SPACING['3xl'] - 4 /* 28 */,
  marginBottom = SPACING.md,
  marginHorizontal = SPACING.xl,
}: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal,
        paddingTop,
        marginBottom,
      }}
    >
      <Text style={[typography.subtitle, { color: COLORS.foreground }]}>{title}</Text>
      {actionLabel ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onAction} disabled={!onAction}>
          <Text style={[typography.labelSemibold, { color: actionColor }]}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
