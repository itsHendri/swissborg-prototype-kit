import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import { Platform } from 'react-native';
import type { ComponentType } from 'react';
import { HomeScreen }        from '../screens/HomeScreen';
import { PortfolioScreen }   from '../screens/PortfolioScreen';
import { TradeScreen }       from '../screens/SwapScreen';
import { MarketplaceScreen } from '../screens/MarketplaceScreen';
import { BottomTabBar }      from '../components/BottomTabBar';

/** Trade tab order types — duplicated here to keep TabParamList standalone. */
export type TradeTabOrderType = 'Trade' | 'Trigger';

/** Marketplace filter tabs — same list as `MarketplaceScreen.FILTER_TABS`. */
export type MarketplaceFilter = 'All' | 'Watchlist' | 'Crypto' | 'Bundles';

export type TabParamList = {
  Home:        undefined;
  Portfolio:   undefined;
  Trade:       { initialOrderType?: TradeTabOrderType } | undefined;
  Marketplace: { initialFilter?: MarketplaceFilter } | undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * Web-only: each tab returns `null` when not focused so the DOM contains
 * one tab tree at a time. RN-Web's bottom-tabs renders all visited tabs
 * as siblings without hiding inactive ones (the standard `display: none`
 * dance from react-native-screens doesn't kick in on web), so they pile
 * up visually. Focus-gating fixes the DOM layering and is exactly what
 * we want for HTML capture into Figma.
 *
 * On native this is a no-op — returns the component unchanged so React
 * Navigation's normal screen-preservation behaviour stays intact.
 *
 * Trade-off on web: tab state (scroll position, form values) resets when
 * you leave a tab. This is acceptable because web is only used for the
 * Figma export flow — see WEB_EXPORT.md.
 */
function gateByFocusWeb<P extends object>(Component: ComponentType<P>): ComponentType<P> {
  if (Platform.OS !== 'web') return Component;
  return function FocusGatedTab(props: P) {
    const focused = useIsFocused();
    if (!focused) return null;
    return <Component {...props} />;
  };
}

const HomeTab        = gateByFocusWeb(HomeScreen);
const PortfolioTab   = gateByFocusWeb(PortfolioScreen);
const TradeTab       = gateByFocusWeb(TradeScreen);
const MarketplaceTab = gateByFocusWeb(MarketplaceScreen);

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Let MainLayout's bg + ShimmerGrid show through every tab screen.
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tab.Screen name="Home"        component={HomeTab}        />
      <Tab.Screen name="Portfolio"   component={PortfolioTab}   />
      <Tab.Screen name="Trade"       component={TradeTab}       />
      <Tab.Screen name="Marketplace" component={MarketplaceTab} />
    </Tab.Navigator>
  );
}
