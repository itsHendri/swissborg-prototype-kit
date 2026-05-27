import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { RADIUS } from '../../constants/ui';

type Props = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
};

// iOS-standard track / thumb dimensions — large enough to be a comfortable
// touch target. We deliberately removed the previous 'sm' size: it was
// too small for accessibility and rarely fit a real settings row anyway.
const TRACK_W = 51;
const TRACK_H = 31;
const THUMB   = 27;
const INSET   = 2;

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
export function Switch({ value, onValueChange, disabled = false }: Props) {
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
    outputRange: [0, TRACK_W - THUMB - INSET * 2],
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
          width: TRACK_W,
          height: TRACK_H,
          borderRadius: RADIUS.full,
          backgroundColor: trackColor,
          padding: INSET,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <Animated.View
          style={{
            width: THUMB,
            height: THUMB,
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
