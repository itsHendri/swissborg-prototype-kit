import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, LayoutAnimation, Platform, Pressable, Text, UIManager, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  title: string;
  /** Optional secondary line shown under the title. */
  subtitle?: string;
  /** Body revealed when expanded. */
  children: ReactNode;
  /** Default: false. */
  defaultOpen?: boolean;
  /** Suppress the bottom divider — use for the last accordion in a card. */
  last?: boolean;
};

/**
 * Collapsible section with a chevron that rotates 180° when open.
 *
 * Designed to nest inside a `<Card padding="rows">`. Layout transitions use
 * `LayoutAnimation` so the surrounding scroll view stays smooth.
 */
export function Accordion({ title, subtitle, children, defaultOpen = false, last = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const rotation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: open ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [open, rotation]);

  const chevronStyle = {
    transform: [{
      rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }),
    }],
  };

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'));
    setOpen(o => !o);
  };

  return (
    <View
      style={{
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: COLORS.divider,
      }}
    >
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: SPACING.md + 2,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>{title}</Text>
          {subtitle ? (
            <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: 2 }]}>{subtitle}</Text>
          ) : null}
        </View>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={18} color={COLORS.foregroundMuted} />
        </Animated.View>
      </Pressable>
      {open ? (
        <View style={{ paddingBottom: SPACING.md + 2 }}>
          {children}
        </View>
      ) : null}
    </View>
  );
}
