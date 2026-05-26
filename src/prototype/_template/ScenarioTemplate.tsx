/**
 * Copy this file to start a new prototype variant.
 *
 *   1. Duplicate this file under `src/prototype/<feature>/<Variant>.tsx`
 *      (the leading `_template` directory is a designer-facing example only —
 *      never import it into `scenarios.tsx`).
 *   2. Rename the exported function to match the file name.
 *   3. Replace the body below with your variant.
 *   4. Register it in `src/prototype/scenarios.tsx`:
 *
 *        import { HomeV1 } from './home/HomeV1';
 *        export const scenarios: Scenario[] = [
 *          { id: 'home-v1', label: 'Home — V1', tab: 'Home', component: HomeV1 },
 *        ];
 *
 *   5. Open Profile → Scenarios in the running app, tap your variant.
 *
 * The skeleton below is the canonical shape for a tab scenario:
 * shimmer background, animated page title bar, scroll view with sensible
 * insets. Replace the `<Card>` block with your real content.
 */

import { useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageTitleBar, PAGE_TITLE_BAR_HEIGHT } from '../../components/shared/PageTitleBar';
import { ShimmerGrid } from '../../components/shared/ShimmerGrid';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { typography } from '../../constants/typography';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

export function ScenarioTemplate() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [count, setCount] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
      <ShimmerGrid />
      <PageTitleBar title="Scenario template" scrollY={scrollY} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: PAGE_TITLE_BAR_HEIGHT,
          paddingBottom: SPACING['4xl'],
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <Card padding="all">
          <Text style={[typography.title, { color: COLORS.foreground }]}>
            Hello from your scenario
          </Text>
          <Text style={[typography.body, { color: COLORS.foregroundMuted, marginTop: SPACING.sm }]}>
            You tapped {count} time{count === 1 ? '' : 's'}.
          </Text>
          <View style={{ marginTop: SPACING.lg }}>
            <Button label="Tap me" onPress={() => setCount(c => c + 1)} />
          </View>
        </Card>
      </Animated.ScrollView>
    </View>
  );
}
