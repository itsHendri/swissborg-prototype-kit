import { View, Text, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Props = {
  /** Leading visual — typically an `<IconCircle />` or `<CryptoIcon size={36} />`. */
  leading: ReactNode;
  /** Primary line (foreground, bodyMedium). */
  primary: string;
  /** Secondary line under primary (muted, label). */
  secondary?: string;
  /** Right-aligned value (bodySemibold). */
  value?: string;
  /** Override value colour. Default: `COLORS.foreground`. */
  valueColor?: string;
  /** Sublabel under value (label). */
  sublabel?: string;
  /** Override sublabel colour. Default: `COLORS.accent`. */
  sublabelColor?: string;
  /**
   * Custom trailing content (chevron, badge, custom widget). Replaces the
   * value/sublabel stack when provided — use for menu / navigation rows.
   */
  trailing?: ReactNode;
  /** Tap handler. When omitted the row is non-interactive. */
  onPress?: () => void;
  /** Suppress the bottom divider (use for the last row in a card). Default: false. */
  last?: boolean;
  /** Vertical padding override. Default: 12 (the list-row spec — never 14). */
  paddingVertical?: number;
  /** Dim the row (e.g. "inactive" earn position). Default: 1. */
  opacity?: number;
  /** Optional override for the primary weight — use `semibold` for action items. */
  primaryWeight?: 'medium' | 'semibold';
  /** Style passthrough (rarely needed). */
  style?: StyleProp<ViewStyle>;
};

/**
 * Canonical list-row used across Holdings, Earn, Activity, Marketplace, and
 * action-item cards. Enforces the design-system list-row spec:
 *
 *   leading (36) · primary/secondary · value/sublabel · NO chevron
 *   paddingVertical: 12 · divider `COLORS.divider` · inline `typography.*` styles
 */
export function ListRow({
  leading,
  primary,
  secondary,
  value,
  valueColor = COLORS.foreground,
  sublabel,
  sublabelColor = COLORS.accent,
  trailing,
  onPress,
  last = false,
  paddingVertical = SPACING.md,
  opacity = 1,
  primaryWeight = 'medium',
  style,
}: Props) {
  const Container: any = onPress ? TouchableOpacity : View;
  const primaryStyle = primaryWeight === 'semibold' ? typography.bodySemibold : typography.bodyMedium;

  return (
    <Container
      activeOpacity={onPress ? 0.7 : undefined}
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical,
          borderBottomWidth: last ? 0 : 1,
          borderBottomColor: COLORS.divider,
          opacity,
        },
        style,
      ]}
    >
      {leading}
      <View style={{ flex: 1, marginLeft: SPACING.md }}>
        <Text style={[primaryStyle, { color: COLORS.foreground }]}>{primary}</Text>
        {secondary ? (
          <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: 2 }]}>{secondary}</Text>
        ) : null}
      </View>
      {trailing
        ? trailing
        : (value || sublabel) && (
          <View style={{ alignItems: 'flex-end' }}>
            {value ? (
              <Text style={[typography.bodySemibold, { color: valueColor }]}>{value}</Text>
            ) : null}
            {sublabel ? (
              <Text style={[typography.label, { color: sublabelColor, marginTop: 2 }]}>
                {sublabel}
              </Text>
            ) : null}
          </View>
        )}
    </Container>
  );
}
