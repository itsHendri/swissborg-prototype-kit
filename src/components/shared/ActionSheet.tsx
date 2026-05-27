import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHaptic } from '../../hooks/useHaptic';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';

type IconName = ComponentProps<typeof Ionicons>['name'];

export type ActionSheetItem = {
  label: string;
  /** Optional leading Ionicon. */
  icon?: IconName;
  /** Render in destructive red. */
  destructive?: boolean;
  /** Disable interaction. */
  disabled?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  /** Optional title rendered above the action list. */
  title?: string;
  /** Optional descriptive line under the title. */
  description?: string;
  items: ActionSheetItem[];
  /** Cancel button label. Default: 'Cancel'. */
  cancelLabel?: string;
  onClose: () => void;
};

/**
 * iOS-style action sheet — a vertical list of actions with leading
 * icons + an optional destructive treatment, plus a Cancel button in a
 * separate group.
 *
 * Distinct from `BottomSheet`:
 *   - `BottomSheet` is the **option picker** — one of N values gets
 *     selected and the sheet closes.
 *   - `ActionSheet` is the **action menu** — each row fires a different
 *     callback (share / favorite / report / delete). No selection
 *     state.
 *
 *   <ActionSheet
 *     visible={open}
 *     onClose={close}
 *     title="Manage transaction"
 *     items={[
 *       { label: 'Share receipt', icon: 'share-outline', onPress: share },
 *       { label: 'Favourite',     icon: 'star-outline',  onPress: fave  },
 *       { label: 'Hide',          icon: 'eye-off-outline', onPress: hide },
 *       { label: 'Report issue',  icon: 'flag-outline', destructive: true, onPress: report },
 *     ]}
 *   />
 */
export function ActionSheet({
  visible,
  title,
  description,
  items,
  cancelLabel = 'Cancel',
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const haptic = useHaptic();

  const handle = (item: ActionSheetItem) => {
    if (item.disabled) return;
    haptic(item.destructive ? 'impactHeavy' : 'selection');
    item.onPress();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
      >
        {/* Stop propagation so taps inside the sheet don't dismiss. */}
        <Pressable
          onPress={() => {}}
          style={{ paddingHorizontal: SPACING.md, paddingBottom: insets.bottom + SPACING.md, gap: SPACING.sm }}
        >
          {/* Main group: title + items */}
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: RADIUS.card,
              overflow: 'hidden',
            }}
          >
            {title || description ? (
              <View
                style={{
                  paddingVertical: SPACING.md,
                  paddingHorizontal: SPACING.lg,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.divider,
                  alignItems: 'center',
                }}
              >
                {title ? (
                  <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>{title}</Text>
                ) : null}
                {description ? (
                  <Text
                    style={[
                      typography.label,
                      { color: COLORS.foregroundMuted, marginTop: 2, textAlign: 'center' },
                    ]}
                  >
                    {description}
                  </Text>
                ) : null}
              </View>
            ) : null}

            {items.map((item, idx) => {
              const isLast = idx === items.length - 1;
              const color = item.destructive ? COLORS.destructive : COLORS.foreground;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => handle(item)}
                  disabled={item.disabled}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: SPACING.md,
                    paddingVertical: SPACING.md + 2,
                    paddingHorizontal: SPACING.lg,
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: COLORS.divider,
                    backgroundColor: pressed ? COLORS.iconBg : 'transparent',
                    opacity: item.disabled ? 0.4 : 1,
                  })}
                >
                  {item.icon ? (
                    <Ionicons name={item.icon} size={20} color={color} />
                  ) : null}
                  <Text style={[typography.body, { color, flex: 1 }]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Cancel group — visually separated. */}
          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({
              backgroundColor: pressed ? COLORS.iconBg : COLORS.surface,
              borderRadius: RADIUS.card,
              paddingVertical: SPACING.md + 2,
              alignItems: 'center',
            })}
          >
            <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>
              {cancelLabel}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
