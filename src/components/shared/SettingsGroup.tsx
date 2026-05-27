import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Card } from './Card';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type Props = {
  /** Uppercase section header — Apple-style. Omit for an untitled group. */
  title?: string;
  /** Small paragraph rendered under the group of rows as helper text. */
  footnote?: string;
  /** `<ListRow>` instances. Pass `last` to the final row. */
  children: ReactNode;
};

/**
 * iOS-style grouped settings section: uppercase header + a card of rows
 * + an optional helper-text footnote under the card.
 *
 *   <SettingsGroup title="Notifications" footnote="You can change these anytime.">
 *     <ListRow primary="Marketing"     trailing={<Switch ... />} />
 *     <ListRow primary="Product news"  trailing={<Switch ... />} />
 *     <ListRow primary="Push"          trailing={<Switch ... />} last />
 *   </SettingsGroup>
 */
export function SettingsGroup({ title, footnote, children }: Props) {
  return (
    <View style={{ marginBottom: SPACING.lg }}>
      {title ? (
        <Text
          style={{
            color: COLORS.foregroundMuted,
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            paddingHorizontal: SPACING.xl,
            paddingTop: SPACING.sm,
            paddingBottom: SPACING.sm,
          }}
        >
          {title}
        </Text>
      ) : null}
      <Card padding="rows">{children}</Card>
      {footnote ? (
        <Text
          style={[
            typography.label,
            { color: COLORS.foregroundMuted, paddingHorizontal: SPACING.xl, marginTop: SPACING.sm },
          ]}
        >
          {footnote}
        </Text>
      ) : null}
    </View>
  );
}
