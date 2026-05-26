import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { userProfile, getInitials } from '../data/user';
import { COLORS } from '../constants/colors';
import { typography } from '../constants/typography';
import { SPACING } from '../constants/spacing';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/**
 * Height of the AppHeader row (excludes safe-area inset).
 * Tab screens use `insets.top + APP_HEADER_HEIGHT` as their ScrollView paddingTop.
 */
export const APP_HEADER_HEIGHT = 60;

export function AppHeader() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.lg,
      paddingVertical: 12,
      gap: SPACING.md,
      height: APP_HEADER_HEIGHT,
    }}>
      {/* Avatar — taps into Profile (and the Scenarios picker). */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.8}>
        <View style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: '#1A3A2E',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: COLORS.accent, fontSize: 12, fontWeight: '700' }}>
            {getInitials(userProfile.name)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* App title placeholder. Replace with your prototype's brand mark. */}
      <Text style={[typography.bodySemibold, { color: COLORS.foreground, flex: 1 }]}>
        Prototype Kit
      </Text>
    </View>
  );
}
