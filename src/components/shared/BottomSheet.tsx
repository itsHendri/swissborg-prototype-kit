import { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { RADIUS } from '../../constants/ui';
import { typography, FONT_SIZE } from '../../constants/typography';

type BottomSheetProps<T extends string> = {
  visible: boolean;
  title: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  onClose: () => void;
};

export function BottomSheet<T extends string>({
  visible,
  title,
  options,
  value,
  onChange,
  onClose,
}: BottomSheetProps<T>) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {/* Scrim */}
        <Animated.View
          style={{
            ...AbsoluteFill,
            backgroundColor: 'rgba(0,0,0,0.6)',
            opacity: backdropOpacity,
          }}
        >
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        </Animated.View>

        {/* Sheet panel */}
        <Animated.View
          style={{
            transform: [{ translateY }],
            backgroundColor: COLORS.surface,
            borderTopLeftRadius: RADIUS.pill,
            borderTopRightRadius: RADIUS.pill,
            paddingBottom: Math.max(insets.bottom, SPACING.lg),
          }}
        >
          {/* Drag handle */}
          <View style={{ alignItems: 'center', paddingTop: SPACING.md, marginBottom: SPACING.lg }}>
            <View style={{
              width: 36, height: 4, borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.2)',
            }} />
          </View>

          {/* Title */}
          <Text style={[
            typography.bodyMedium,
            { color: COLORS.foregroundMuted, paddingHorizontal: SPACING.xl, marginBottom: SPACING.sm },
          ]}>
            {title}
          </Text>

          {/* Options */}
          {options.map((option, i) => {
            const selected = option === value;
            const last = i === options.length - 1;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => onChange(option)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: SPACING.xl,
                  paddingVertical: SPACING.lg,
                  borderBottomWidth: last ? 0 : 1,
                  borderBottomColor: COLORS.divider,
                }}
              >
                <Text style={{
                  fontSize: FONT_SIZE.subtitle,
                  fontWeight: selected ? '600' : '400',
                  color: selected ? COLORS.foreground : COLORS.foregroundMuted,
                }}>
                  {option}
                </Text>
                {selected && (
                  <Ionicons name="checkmark" size={20} color={COLORS.accent} />
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>
    </Modal>
  );
}

const AbsoluteFill = {
  position: 'absolute' as const,
  top: 0, left: 0, right: 0, bottom: 0,
};
