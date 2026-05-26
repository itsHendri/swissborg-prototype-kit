import { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/colors';

type TabConfig = {
  name: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  iconActive: ComponentProps<typeof Ionicons>['name'];
};

// Display labels shown under each tab icon. Intentionally decoupled from the
// underlying `route.name` in TabNavigator — renames here stay cosmetic so
// every existing `navigation.navigate('Portfolio' | 'Marketplace')` callsite
// keeps working without a sweeping rename through the codebase.
const TABS: TabConfig[] = [
  { name: 'Home',     icon: 'grid-outline',            iconActive: 'grid'            },
  { name: 'Accounts', icon: 'wallet-outline',          iconActive: 'wallet'          },
  { name: 'Trade',    icon: 'swap-horizontal-outline', iconActive: 'swap-horizontal' },
  { name: 'Discover', icon: 'compass-outline',         iconActive: 'compass'         },
];

const ACTIVE   = COLORS.accent;
const INACTIVE = COLORS.foregroundMuted;
const DOT_SIZE = 4;
const TAB_COUNT = TABS.length;

/**
 * Height of the tab-bar's inner row (icon + label + indicator dot placeholder),
 * excluding the safe-area bottom padding. Exported so screen-level overlays
 * (e.g. the Accounts page's floating glass lozenge) can anchor themselves a
 * fixed distance above the tab bar without re-measuring it at runtime.
 */
export const BOTTOM_TAB_INNER_HEIGHT = 60;

const SCREEN_W = Dimensions.get('window').width;
const TAB_W    = SCREEN_W / TAB_COUNT;

/** X position of the dot centre for a given tab index. */
function dotX(index: number) {
  return index * TAB_W + TAB_W / 2 - DOT_SIZE / 2;
}

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets  = useSafeAreaInsets();
  const slideX  = useRef(new Animated.Value(dotX(state.index))).current;

  useEffect(() => {
    Animated.spring(slideX, {
      toValue: dotX(state.index),
      useNativeDriver: true,
      damping: 30,
      stiffness: 200,
      mass: 1,
    }).start();
  }, [state.index, slideX]);

  return (
    <View
      className="bg-background border-t border-line"
      style={{ paddingBottom: insets.bottom || 8 }}
    >
      {/* Inner row — absolute dot is positioned relative to this View */}
      <View style={{ flexDirection: 'row' }}>
        {state.routes.map((route, index) => {
          const tab     = TABS[index];
          const focused = state.index === index;
          const color   = focused ? ACTIVE : INACTIVE;

          return (
            <TouchableOpacity
              key={route.key}
              className="flex-1 items-center pt-3 pb-1"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate(route.name);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={focused ? tab.iconActive : tab.icon}
                size={22}
                color={color}
              />
              <Text className="text-xs mt-1" style={{ color }}>
                {tab.name}
              </Text>
              {/* Height placeholder — keeps layout identical to before */}
              <View style={{ width: DOT_SIZE, height: DOT_SIZE, marginTop: 3 }} />
            </TouchableOpacity>
          );
        })}

        {/* Single sliding indicator dot */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: 4,
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: DOT_SIZE / 2,
            backgroundColor: ACTIVE,
            transform: [{ translateX: slideX }],
          }}
        />
      </View>
    </View>
  );
}
