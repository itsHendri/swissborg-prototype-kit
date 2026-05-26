import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';
import { FONT_SIZE } from '../../constants/typography';

interface ShortcutButtonProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress?: () => void;
}

export function ShortcutButton({ icon, label, onPress }: ShortcutButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ alignItems: 'center' }}
    >
      <View style={{
        width: 56,
        height: 56,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
      }}>
        <Ionicons name={icon} size={22} color={COLORS.background} />
      </View>
      <Text style={{ color: COLORS.foreground, fontSize: FONT_SIZE.label, fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );
}
