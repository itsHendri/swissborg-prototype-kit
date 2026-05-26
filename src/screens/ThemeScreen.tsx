import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext, type ThemeMode } from '../context/ThemeContext';
import { PageTitleBar, PAGE_TITLE_BAR_HEIGHT } from '../components/shared/PageTitleBar';
import { Card } from '../components/shared/Card';
import { ListRow } from '../components/shared/ListRow';
import { ShimmerGrid } from '../components/shared/ShimmerGrid';
import { IconCircle } from '../components/shared/IconCircle';
import { typography } from '../constants/typography';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { RADIUS } from '../constants/ui';

type Option = {
  mode: ThemeMode;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const OPTIONS: Option[] = [
  {
    mode: 'system',
    label: 'System',
    description: 'Follows your device setting',
    icon: 'phone-portrait-outline',
  },
  {
    mode: 'light',
    label: 'Light',
    description: 'Always use light appearance',
    icon: 'sunny-outline',
  },
  {
    mode: 'dark',
    label: 'Dark',
    description: 'Always use dark appearance',
    icon: 'moon-outline',
  },
];

/** Custom radio indicator — outer ring + inner dot when selected. */
function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: RADIUS.full,
        borderWidth: 2,
        borderColor: selected ? COLORS.accent : COLORS.placeholder,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {selected ? (
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: RADIUS.full,
            backgroundColor: COLORS.accent,
          }}
        />
      ) : null}
    </View>
  );
}

export function ThemeScreen() {
  const insets = useSafeAreaInsets();
  const { mode, setMode } = useThemeContext();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: insets.top }}>
      <ShimmerGrid />
      <PageTitleBar title="Theme" />

      {/* Options */}
      <View style={{ marginTop: PAGE_TITLE_BAR_HEIGHT }}>
        <Card padding="rows">
          {OPTIONS.map((option, i) => {
            const selected = mode === option.mode;
            return (
              <ListRow
                key={option.mode}
                leading={
                  <IconCircle
                    icon={option.icon}
                    bg={COLORS.background}
                    color={selected ? COLORS.accent : COLORS.foregroundMuted}
                  />
                }
                primary={option.label}
                primaryWeight="semibold"
                secondary={option.description}
                trailing={<RadioIndicator selected={selected} />}
                onPress={() => setMode(option.mode)}
                last={i === OPTIONS.length - 1}
                paddingVertical={SPACING.lg}
              />
            );
          })}
        </Card>
      </View>

      {/* Note */}
      <Text
        style={[
          typography.label,
          {
            color: COLORS.foregroundMuted,
            textAlign: 'center',
            marginTop: SPACING.xl,
            paddingHorizontal: SPACING['3xl'],
          },
        ]}
      >
        Full light mode styling coming soon. Dark mode is currently the default appearance.
      </Text>
    </View>
  );
}
