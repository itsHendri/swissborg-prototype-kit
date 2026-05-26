import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';
import { FONT_SIZE } from '../../constants/typography';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  /** Optional leading icon. */
  icon?: IconName;
  /** Visual size. Default: md. */
  size?: 'sm' | 'md';
};

/**
 * Neutral filter / category chip. Active state is the design-system-mandated
 * neutral treatment (`COLORS.selectionBg` + 12% white border), never brand
 * green. Reserve brand green for CTAs and positive P&L — not for selection.
 */
export function FilterChip({
  label,
  active = false,
  onPress,
  icon,
  size = 'md',
}: Props) {
  const padV     = size === 'sm' ? SPACING.xs + 2 /* 6 */ : SPACING.sm;
  const padH     = size === 'sm' ? SPACING.sm + 2 /* 10 */ : SPACING.md;
  const fontSize = size === 'sm' ? FONT_SIZE.label : FONT_SIZE.body;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs + 2 /* 6 */,
        paddingVertical: padV,
        paddingHorizontal: padH,
        borderRadius: RADIUS.pill,
        backgroundColor: active ? COLORS.selectionBg : COLORS.surface,
        borderWidth: 1,
        borderColor: active ? COLORS.selectionBorder : 'transparent',
      }}
    >
      {icon ? (
        <Ionicons name={icon} size={14} color={active ? COLORS.foreground : COLORS.foregroundMuted} />
      ) : null}
      <Text
        style={{
          fontSize,
          fontWeight: '500',
          color: active ? COLORS.foreground : COLORS.foregroundMuted,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
