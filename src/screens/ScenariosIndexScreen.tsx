/**
 * Web-only stakeholder browse surface. Lists every registered scenario
 * with a single "Open" link. Click the link → URL becomes
 * `?scenario=<id>` and routes to the relevant tab so the share recipient
 * lands directly on the variant.
 *
 * Hidden on native — PMs / CEOs open this in a browser via the EAS Update
 * web URL or the dev server.
 */

import { useRef } from 'react';
import { Animated, Text, View, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { PageTitleBar, PAGE_TITLE_BAR_HEIGHT } from '../components/shared/PageTitleBar';
import { Card } from '../components/shared/Card';
import { Badge } from '../components/shared/Badge';
import { ShimmerGrid } from '../components/shared/ShimmerGrid';
import { typography } from '../constants/typography';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { RADIUS } from '../constants/ui';
import { scenarios, setActiveScenario, type TabKey } from '../prototype/scenarios';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TAB_ORDER: TabKey[] = ['Home', 'Portfolio', 'Trade', 'Marketplace'];

export function ScenariosIndexScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<Nav>();

  const grouped = TAB_ORDER
    .map(tab => ({ tab, list: scenarios.filter(s => s.tab === tab) }))
    .filter(g => g.list.length > 0);

  const openScenario = (tab: TabKey, id: string) => {
    setActiveScenario(tab, id);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('scenario', id);
      window.history.replaceState({}, '', url.toString());
    }
    navigation.navigate('Main');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
      <ShimmerGrid />
      <PageTitleBar title="Scenarios" scrollY={scrollY} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: PAGE_TITLE_BAR_HEIGHT, paddingBottom: SPACING['4xl'] }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        <View style={{ paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg }}>
          <Text style={[typography.body, { color: COLORS.foregroundMuted }]}>
            Every registered variant in this prototype. Click one to open it on the matching tab. The link includes
            <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}> ?scenario=&lt;id&gt; </Text>
            so you can share the URL directly.
          </Text>
        </View>

        {grouped.length === 0 ? (
          <Card padding="all">
            <Text style={[typography.body, { color: COLORS.foregroundMuted }]}>
              No scenarios are registered. Add entries to{' '}
              <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>
                src/prototype/scenarios.tsx
              </Text>
              {' '}to populate this index.
            </Text>
          </Card>
        ) : null}

        {grouped.map(({ tab, list }) => (
          <View key={tab} style={{ marginBottom: SPACING.lg }}>
            <Text
              style={[
                typography.labelSemibold,
                {
                  color: COLORS.foreground,
                  paddingHorizontal: SPACING.xl,
                  marginBottom: SPACING.sm,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                },
              ]}
            >
              {tab}
            </Text>
            <Card padding="rows">
              {list.map((s, i) => {
                const isLast = i === list.length - 1;
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => openScenario(s.tab, s.id)}
                    style={({ pressed }) => ({
                      paddingVertical: SPACING.md + 2,
                      borderBottomWidth: isLast ? 0 : 1,
                      borderBottomColor: COLORS.divider,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                      <Text style={[typography.bodySemibold, { color: COLORS.foreground, flex: 1 }]}>{s.label}</Text>
                      <View
                        style={{
                          borderRadius: RADIUS.full,
                          paddingHorizontal: SPACING.md,
                          paddingVertical: 4,
                          backgroundColor: `${COLORS.accent}22`,
                        }}
                      >
                        <Text style={{ color: COLORS.accent, fontSize: 12, fontWeight: '700' }}>Open</Text>
                      </View>
                    </View>
                    {s.description ? (
                      <Text style={[typography.label, { color: COLORS.foregroundMuted, marginTop: 2 }]}>
                        {s.description}
                      </Text>
                    ) : null}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: 6 }}>
                      <Badge label={`?scenario=${s.id}`} tone="dev" size="tag" />
                    </View>
                  </Pressable>
                );
              })}
            </Card>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}
