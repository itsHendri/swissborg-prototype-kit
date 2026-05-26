import { useRef } from 'react';
import { Animated, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_HEADER_HEIGHT } from '../components/AppHeader';
import { useAppScroll } from '../context/AppScrollContext';
import { useActiveScenario, type TabKey } from '../prototype/scenarios';
import { typography } from '../constants/typography';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';

/**
 * Tab router shell.
 *
 * Each bottom-tab screen (Home/Portfolio/Trade/Marketplace) renders this
 * with its tab key. If a scenario is registered + active for that tab,
 * its component is rendered; otherwise an empty-state placeholder points
 * the user at the scenario picker.
 */
export function TabScreen({ tab }: { tab: TabKey }) {
  const scenario = useActiveScenario(tab);

  if (scenario) {
    const Component = scenario.component;
    return <Component />;
  }

  return <EmptyTab tab={tab} />;
}

function EmptyTab({ tab }: { tab: TabKey }) {
  const insets = useSafeAreaInsets();
  const { scrollY } = useAppScroll();
  const scrollYRef = useRef(scrollY).current;

  return (
    <Animated.ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top + APP_HEADER_HEIGHT,
        paddingBottom: 40,
        paddingHorizontal: SPACING.xl,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollYRef } } }],
        { useNativeDriver: false },
      )}
      scrollEventThrottle={16}
    >
      <View style={{ alignItems: 'center', gap: SPACING.md, maxWidth: 320 }}>
        <Text style={[typography.title, { color: COLORS.foreground, textAlign: 'center' }]}>
          {tab}
        </Text>
        <Text style={[typography.body, { color: COLORS.foregroundMuted, textAlign: 'center' }]}>
          No scenario selected. Tap the avatar to open Profile → Scenarios and pick a variant.
        </Text>
      </View>
    </Animated.ScrollView>
  );
}
