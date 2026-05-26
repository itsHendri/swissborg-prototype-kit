import { View, Text } from 'react-native';
import type { ReactNode } from 'react';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Props = {
  /**
   * Leading icon or element. Pass a `<GlassIcon>`, `<Ionicons>`, or any
   * component — rendered bare in the card (no tinted container around it).
   * Size the icon at the call site (e.g. GlassIcon size=36 for row usage).
   */
  icon: ReactNode;
  title: string;
  body: string;
};

/**
 * Icon + title + body info row. Used on terms / risk / onboarding screens
 * where a vertical stack of short explanations is needed.
 *
 * The icon sits directly in the card — no inner tinted square. Glass icons
 * already carry their own visual treatment; Ionicon callers render at their
 * natural size.
 *
 * Always rendered inside a parent with horizontal padding.
 */
export function InfoCard({ icon, title, body }: Props) {
  return (
    <View
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.card,
        padding: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.md + 2 /* 14 */,
      }}
    >
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={[typography.subtitle, { color: COLORS.foreground }]}>{title}</Text>
        <Text style={[typography.body, { color: COLORS.foregroundMuted, marginTop: SPACING.xs }]}>
          {body}
        </Text>
      </View>
    </View>
  );
}
