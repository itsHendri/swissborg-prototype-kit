/**
 * One labelled section in the Dev Kit (StylesScreen).
 *
 * Wraps the existing pattern (uppercase section label + free-form body)
 * so every section is filterable by the Dev Kit's search field and
 * carries an optional one-line API summary so designers can see the
 * shape of a component without opening its source.
 *
 * Lives in `components/shared/` because the Profile-only Dev Kit screen
 * is the canonical consumer; nothing else should render this directly.
 */

import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { typography, FONT_SIZE } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Props = {
  /** The title shown above the section. Also the filter key. */
  title: string;
  /**
   * Extra strings the Dev Kit search matches against. Useful when the
   * conventional name differs from how someone would search ("toggle"
   * for `Switch`, "stepper" for "Progress").
   */
  aliases?: string[];
  /** Active filter from the Dev Kit search field. Empty string = show all. */
  filter: string;
  /** One-line API hint: `<Switch value onValueChange size? />`. */
  api?: string;
  /** Short caption shown under the body — usage guidance. */
  caption?: string;
  children: ReactNode;
};

export function DevKitSection({ title, aliases, filter, api, caption, children }: Props) {
  const haystack = [title, ...(aliases ?? [])].join(' ').toLowerCase();
  if (filter && !haystack.includes(filter.toLowerCase())) return null;

  return (
    <View style={{ marginTop: SPACING['3xl'] - 4 }}>
      <Text
        style={{
          color: COLORS.foregroundMuted,
          fontSize: FONT_SIZE.label,
          fontWeight: '600',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          paddingHorizontal: SPACING.xl,
          marginBottom: SPACING.md,
        }}
      >
        {title}
      </Text>

      {children}

      {api ? (
        <View
          style={{
            marginTop: SPACING.sm,
            marginHorizontal: SPACING.xl,
            paddingVertical: SPACING.sm,
            paddingHorizontal: SPACING.md,
            backgroundColor: COLORS.surface,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.divider,
          }}
        >
          <Text
            style={{
              color: COLORS.foregroundMuted,
              fontSize: FONT_SIZE.label,
              fontFamily: 'monospace',
            }}
          >
            {api}
          </Text>
        </View>
      ) : null}

      {caption ? (
        <Text
          style={[
            typography.label,
            { color: COLORS.foregroundMuted, paddingHorizontal: SPACING.xl, marginTop: SPACING.sm },
          ]}
        >
          {caption}
        </Text>
      ) : null}
    </View>
  );
}
