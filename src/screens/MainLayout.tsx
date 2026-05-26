import { View, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader }    from '../components/AppHeader';
import { TabNavigator } from '../navigation/TabNavigator';
import { ShimmerGrid } from '../components/shared/ShimmerGrid';
import { useAppScroll } from '../context/AppScrollContext';
import { useTabChrome } from '../context/TabChromeContext';

export function MainLayout() {
  const insets = useSafeAreaInsets();
  const { scrollY } = useAppScroll();
  const { hideAppHeader } = useTabChrome();

  const blurOpacity = scrollY.interpolate({
    inputRange: [0, 20],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1 bg-background">
      {/* Ambient dot-grid behind every tab screen. Screens keep transparent
          roots so this layer shows through. */}
      <ShimmerGrid />
      <View style={{ flex: 1 }}>
        <TabNavigator />
      </View>

      {/* Floating app header — blur fades in on scroll. Tabs may opt out via
          `useTabChrome().hideAppHeader`. */}
      {!hideAppHeader && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            paddingTop: insets.top,
            zIndex: 20,
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: blurOpacity,
            }}
          >
            <BlurView tint="dark" intensity={80} style={{ flex: 1, overflow: 'hidden' }} />
          </Animated.View>

          <AppHeader />
        </View>
      )}
    </View>
  );
}
