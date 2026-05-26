import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { RADIUS } from '../../constants/ui';

export type SwitchSize = 'sm' | 'md';

type Props = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  /** Default: 'md' (iOS-standard 51×31). 'sm' is 40×24 — for dense rows. */
  size?: SwitchSize;
  disabled?: boolean;
};

type SizeSpec = {
  trackW: number;
  trackH: number;
  thumb: number;
  inset: number;
};

const SIZES: Record<SwitchSize, SizeSpec> = {
  sm: { trackW: 40, trackH: 24, thumb: 20, inset: 2 },
  md: { trackW: 51, trackH: 31, thumb: 27, inset: 2 },
};

/**
 * iOS-style on/off toggle. Accent track when on, surface track when off.
 *
 * Pair with ListRow via the `trailing` slot:
 *
 *   <ListRow
 *     leading={<IconCircle icon="notifications-outline" />}
 *     primary="Notifications"
 *     trailing={<Switch value={enabled} onValueChange={setEnabled} />}
 *   />
 */
export function Switch({ value, onValueChange, size = 'md', disabled = false }: Props) {
  const s = SIZES[size];
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.surface, COLORS.accent],
  });
  const thumbTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, s.trackW - s.thumb - s.inset * 2],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
      hitSlop={8}
    >
      <Animated.View
        style={{
          width: s.trackW,
          height: s.trackH,
          borderRadius: RADIUS.full,
          backgroundColor: trackColor,
          padding: s.inset,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <Animated.View
          style={{
            width: s.thumb,
            height: s.thumb,
            borderRadius: RADIUS.full,
            backgroundColor: COLORS.foreground,
            transform: [{ translateX: thumbTranslate }],
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
            elevation: 2,
          }}
        />
        {/* Hit target — keeps a clean visual but gives a comfortable tap area. */}
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      </Animated.View>
    </Pressable>
  );
}
