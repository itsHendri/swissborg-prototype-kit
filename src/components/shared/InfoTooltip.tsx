import { useState } from 'react';
import { Modal, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './Button';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type Props = {
  title?: string;
  /** Body copy shown in the popover. */
  message: string;
  /** Icon size. Default: 16. */
  size?: number;
  /** Tint of the (i) icon. Default: foregroundMuted. */
  iconColor?: string;
  /** Wrapper style for the trigger button — useful for `marginLeft: 4` etc. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Info icon → bottom-sheet popover with an explanation. Used for the
 * "what does this mean?" affordance next to regulated copy: APY, fees,
 * slippage, LTV, holding periods, etc.
 *
 * Renders a small (i) icon as the trigger. Self-contained — owns its
 * own open/close state.
 *
 *   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
 *     <Text>APY</Text>
 *     <InfoTooltip
 *       title="What is APY?"
 *       message="Annual percentage yield…"
 *     />
 *   </View>
 */
export function InfoTooltip({
  title,
  message,
  size = 16,
  iconColor = COLORS.foregroundMuted,
  style,
}: Props) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={title ?? 'More info'}
        style={style}
      >
        <Ionicons name="information-circle-outline" size={size} color={iconColor} />
      </Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: COLORS.surface,
              borderTopLeftRadius: RADIUS.xl,
              borderTopRightRadius: RADIUS.xl,
              paddingHorizontal: SPACING.xl,
              paddingTop: SPACING.lg,
              paddingBottom: insets.bottom + SPACING.lg,
              gap: SPACING.md,
            }}
          >
            {/* Drag handle */}
            <View
              style={{
                alignSelf: 'center',
                width: 36, height: 4,
                borderRadius: 2,
                backgroundColor: COLORS.divider,
                marginBottom: SPACING.sm,
              }}
            />
            {title ? (
              <Text style={[typography.title, { color: COLORS.foreground }]}>{title}</Text>
            ) : null}
            <Text style={[typography.body, { color: COLORS.foregroundMuted }]}>{message}</Text>
            <Button label="Got it" fullWidth onPress={() => setOpen(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
