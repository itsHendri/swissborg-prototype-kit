import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { COLORS } from '../constants/colors';
import { MainLayout }    from '../screens/MainLayout';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ThemeScreen }   from '../screens/ThemeScreen';
import { StylesScreen }  from '../screens/StylesScreen';
import { ScenariosIndexScreen } from '../screens/ScenariosIndexScreen';

export type RootStackParamList = {
  Main:    undefined;
  Profile: undefined;
  Theme:   undefined;
  Styles:  undefined;
  /** Web-only. Hidden on native — see ScenariosIndexScreen for context. */
  Scenarios: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="Main"    component={MainLayout} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ animation: 'slide_from_left' }} />
      <Stack.Screen name="Theme"   component={ThemeScreen} />
      <Stack.Screen name="Styles"  component={StylesScreen} options={{ presentation: 'fullScreenModal' }} />
      {Platform.OS === 'web' ? (
        <Stack.Screen name="Scenarios" component={ScenariosIndexScreen} />
      ) : null}
    </Stack.Navigator>
  );
}
