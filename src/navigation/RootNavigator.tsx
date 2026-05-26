import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';
import { MainLayout }    from '../screens/MainLayout';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ThemeScreen }   from '../screens/ThemeScreen';
import { StylesScreen }  from '../screens/StylesScreen';

export type RootStackParamList = {
  Main:    undefined;
  Profile: undefined;
  Theme:   undefined;
  Styles:  undefined;
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
    </Stack.Navigator>
  );
}
