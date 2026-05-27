import { useRef } from 'react';
import { View, Text, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useThemeContext } from '../context/ThemeContext';
import { PageTitleBar, PAGE_TITLE_BAR_HEIGHT } from '../components/shared/PageTitleBar';
import { IconCircle } from '../components/shared/IconCircle';
import { ListRow } from '../components/shared/ListRow';
import { ShimmerGrid } from '../components/shared/ShimmerGrid';
import { Card } from '../components/shared/Card';
import { Badge } from '../components/shared/Badge';
import { typography, FONT_SIZE } from '../constants/typography';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { RADIUS } from '../constants/ui';
import { userProfile, getInitials } from '../data/user';
import {
  scenarios,
  useActiveScenarioId,
  setActiveScenario,
  type TabKey,
} from '../prototype/scenarios';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MODE_LABELS: Record<string, string> = { system: 'System', light: 'Light', dark: 'Dark' };

const TAB_ORDER: TabKey[] = ['Home', 'Portfolio', 'Trade', 'Marketplace'];

function SectionLabel({ label }: { label: string }) {
  return (
    <Text style={{
      color: COLORS.foregroundMuted,
      fontSize: FONT_SIZE.label,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      paddingHorizontal: SPACING.xl,
      marginBottom: SPACING.sm + 2,
    }}>
      {label}
    </Text>
  );
}

function Chevron() {
  return <Ionicons name="chevron-forward" size={16} color={COLORS.foreground} />;
}

function MenuTrailing({ badge, text }: { badge?: React.ReactNode; text?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs + 2 }}>
      {badge}
      {text ? <Text style={[typography.body, { color: COLORS.foregroundMuted }]}>{text}</Text> : null}
      <Chevron />
    </View>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { mode } = useThemeContext();
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
      <ShimmerGrid />
      <PageTitleBar scrollY={scrollY} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING['4xl'], paddingTop: PAGE_TITLE_BAR_HEIGHT }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Avatar */}
        <View style={{ alignItems: 'center', marginTop: SPACING.lg, marginBottom: SPACING['3xl'] - 4 }}>
          <View style={{
            width: 80, height: 80, borderRadius: RADIUS.full,
            backgroundColor: COLORS.surface,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: COLORS.accent, fontWeight: '700', fontSize: 26 }}>
              {getInitials(userProfile.name)}
            </Text>
          </View>
          <Text style={[typography.title, { color: COLORS.foreground, marginTop: SPACING.lg + 2 }]}>
            {userProfile.name}
          </Text>
        </View>

        {/* Scenarios picker — heart of the prototype kit. */}
        <SectionLabel label="Scenarios" />
        <ScenariosCard />

        {/* Dev surfaces */}
        <SectionLabel label="Dev" />
        <Card padding="rows" style={{ marginBottom: SPACING.md }}>
          <ListRow
            leading={<IconCircle><Ionicons name="moon-outline" size={18} color={COLORS.foreground} /></IconCircle>}
            primary="Theme"
            primaryWeight="semibold"
            trailing={<MenuTrailing text={MODE_LABELS[mode]} />}
            onPress={() => navigation.navigate('Theme')}
          />
          <ListRow
            leading={<IconCircle><Ionicons name="grid-outline" size={18} color={COLORS.foreground} /></IconCircle>}
            primary="Components"
            primaryWeight="semibold"
            secondary="Live preview of every shared component"
            trailing={<MenuTrailing badge={<Badge label="DEV" tone="dev" />} />}
            onPress={() => navigation.navigate('Components')}
          />
          <ListRow
            leading={<IconCircle><Ionicons name="color-palette-outline" size={18} color={COLORS.foreground} /></IconCircle>}
            primary="Styles"
            primaryWeight="semibold"
            secondary="Colors, spacing, type, icon assets"
            trailing={<MenuTrailing badge={<Badge label="DEV" tone="dev" />} />}
            onPress={() => navigation.navigate('Styles')}
            last={Platform.OS !== 'web'}
          />
          {Platform.OS === 'web' ? (
            <ListRow
              leading={<IconCircle><Ionicons name="list-outline" size={18} color={COLORS.foreground} /></IconCircle>}
              primary="Scenarios index"
              primaryWeight="semibold"
              secondary="Shareable URL — for stakeholder browse"
              trailing={<MenuTrailing badge={<Badge label="WEB" tone="info" />} />}
              onPress={() => navigation.navigate('Scenarios')}
              last
            />
          ) : null}
        </Card>
      </Animated.ScrollView>
    </View>
  );
}

/**
 * Renders one section per tab. Each tab lists registered scenarios with a
 * tap-to-activate row + a "None" row to clear the selection.
 */
function ScenariosCard() {
  const tabsWithScenarios = TAB_ORDER.filter(
    tab => scenarios.some(s => s.tab === tab),
  );

  if (tabsWithScenarios.length === 0) {
    return (
      <Card padding="all" style={{ marginBottom: SPACING.md }}>
        <Text style={[typography.body, { color: COLORS.foregroundMuted }]}>
          No scenarios registered yet. Copy{' '}
          <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>
            src/prototype/_template/ScenarioTemplate.tsx
          </Text>
          {' '}into a new file, then register it in{' '}
          <Text style={[typography.bodySemibold, { color: COLORS.foreground }]}>
            src/prototype/scenarios.tsx
          </Text>
          {' '}to populate this list. See README → “First scenario in 60 seconds”.
        </Text>
      </Card>
    );
  }

  return (
    <View style={{ gap: SPACING.lg }}>
      {tabsWithScenarios.map(tab => (
        <ScenarioTabSection key={tab} tab={tab} />
      ))}
    </View>
  );
}

function ScenarioTabSection({ tab }: { tab: TabKey }) {
  const activeId = useActiveScenarioId(tab);
  const list = scenarios.filter(s => s.tab === tab);

  return (
    <View>
      <Text style={[typography.labelSemibold, {
        color: COLORS.foreground,
        paddingHorizontal: SPACING.xl,
        marginBottom: SPACING.sm,
      }]}>
        {tab}
      </Text>
      <Card padding="rows">
        {list.map((s, i) => {
          const isActive = activeId === s.id;
          return (
            <ListRow
              key={s.id}
              leading={<IconCircle icon={isActive ? 'checkmark-circle' : 'ellipse-outline'} />}
              primary={s.label}
              primaryWeight="semibold"
              secondary={s.description}
              trailing={
                isActive
                  ? <Ionicons name="checkmark" size={20} color={COLORS.accent} />
                  : undefined
              }
              onPress={() => setActiveScenario(tab, isActive ? undefined : s.id)}
              last={i === list.length - 1}
            />
          );
        })}
      </Card>
    </View>
  );
}
