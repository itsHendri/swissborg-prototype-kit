import { View, Text, TextInput, type TextInputProps, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { RADIUS } from '../../constants/ui';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Props = Omit<TextInputProps, 'style'> & {
  /** Optional caption/label above the field. */
  label?: string;
  /** Small caption below the field (balance, helper text). */
  helper?: string;
  /** Error text — replaces helper and tints the border red. */
  error?: string;
  /** Leading Ionicon inside the field. Ignored if `leadingElement` is provided. */
  leadingIcon?: IconName;
  /**
   * Custom leading element inside the field — e.g. `<CryptoIcon symbol="SOL" />`.
   * Takes precedence over `leadingIcon` when both are passed.
   */
  leadingElement?: ReactNode;
  /** Visual size preset. `display` = large number input, `default` = body, `search` = standard search field. */
  size?: 'default' | 'display' | 'search';
  /** Style passthrough for the outer wrapper. */
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * Standard text input wrapper — surface card background, 12 radius,
 * placeholder tokenised, optional leading icon/element + helper/error copy.
 *
 * `display` renders at `typography.display` (32px / 700) for prominent amount
 * entries used on Trade, Borrow, AddCollateral, and Repay.
 */
export function TextField({
  label,
  helper,
  error,
  leadingIcon,
  leadingElement,
  size = 'default',
  containerStyle,
  ...textInputProps
}: Props) {
  const hasError = Boolean(error);

  const inputStyle =
    size === 'display'
      ? { ...typography.display, color: COLORS.foreground, flex: 1 }
      : size === 'search'
      ? { ...typography.body, color: COLORS.foreground, flex: 1 }
      : { ...typography.bodyMedium, color: COLORS.foreground, flex: 1 };

  const innerPadH = size === 'display' ? SPACING.md + 2 /* 14 */ : SPACING.md;

  return (
    <View style={containerStyle}>
      {label ? (
        <Text style={[typography.label, { color: COLORS.foregroundMuted, marginBottom: SPACING.xs + 2 /* 6 */ }]}>
          {label}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: SPACING.sm + 2 /* 10 */,
          backgroundColor: COLORS.surface,
          borderRadius: RADIUS.card,
          paddingHorizontal: innerPadH,
          paddingVertical: size === 'display' ? SPACING.md + 2 /* 14 */ : SPACING.sm + 2 /* 10 */,
          minHeight: 48,
          borderWidth: 1,
          borderColor: hasError ? COLORS.destructive : 'transparent',
        }}
      >
        {leadingElement
          ? leadingElement
          : leadingIcon
          ? <Ionicons name={leadingIcon} size={16} color={COLORS.foregroundMuted} />
          : null}
        <TextInput
          placeholderTextColor={COLORS.foregroundMuted}
          {...textInputProps}
          style={inputStyle}
        />
      </View>

      {(hasError || helper) && (
        <Text
          style={[
            typography.label,
            { color: hasError ? COLORS.destructive : COLORS.foregroundMuted, marginTop: SPACING.xs + 2 /* 6 */ },
          ]}
        >
          {error ?? helper}
        </Text>
      )}
    </View>
  );
}
