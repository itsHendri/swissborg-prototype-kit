import './global.css';

// ─── Web-only: inject Figma's html-to-design capture script ──────────────
// Lets the Figma MCP (and the html.to.design plugin) read this page and
// import it into a Figma file. No-ops on native — both the `Platform.OS`
// check and the `typeof document` guard short-circuit before touching the
// DOM. See WEB_EXPORT.md for the full export workflow.
import { Platform } from 'react-native';
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  if (!document.querySelector('script[data-figma-capture]')) {
    const s = document.createElement('script');
    s.src = 'https://mcp.figma.com/mcp/html-to-design/capture.js';
    s.async = true;
    s.dataset.figmaCapture = 'true';
    document.head.appendChild(s);
  }
}

// Reanimated v4 strict mode false-positives on React Navigation's legacy
// Animated usage — keep errors only.
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
configureReanimatedLogger({ level: ReanimatedLogLevel.error, strict: false });

import { NavigationContainer, createNavigationContainerRef, type LinkingOptions } from '@react-navigation/native';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { RootNavigator, type RootStackParamList } from './src/navigation/RootNavigator';
import { AppScrollProvider } from './src/context/AppScrollContext';
import { TabChromeProvider } from './src/context/TabChromeContext';
import { NotificationsProvider } from './src/context/NotificationsContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { WatchlistProvider } from './src/context/WatchlistContext';
import { DisplayCurrencyProvider } from './src/context/DisplayCurrencyContext';
import { ToastProvider } from './src/context/ToastContext';
import { BalanceVisibilityProvider } from './src/context/BalanceVisibilityContext';
import { applyScenarioFromUrl } from './src/prototype/scenarios';

// Web flow-capture nav ref (window.__nav). No-op on native.
const navRef = createNavigationContainerRef();

// Web URL routing — only used on the web build. Native ignores this prop.
// `/scenarios` is the PM browse surface; the rest map straight to existing
// stack screens so each can be shared as a direct URL.
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [],
  config: {
    screens: {
      Main:       '',
      Profile:    'profile',
      Theme:      'theme',
      Styles:     'styles',
      Components: 'components',
      Scenarios:  'scenarios',
    },
  },
};

function AppContent() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__nav = navRef;
      // Honour `?scenario=<id>` for deep-linkable prototype variants.
      applyScenarioFromUrl();
    }
  }, []);

  return (
    <DisplayCurrencyProvider>
      <NotificationsProvider>
        <WatchlistProvider>
          <BalanceVisibilityProvider>
            <AppScrollProvider>
              <TabChromeProvider>
                  <ToastProvider>
                  <NavigationContainer
                    ref={navRef}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    linking={Platform.OS === 'web' ? (linking as any) : undefined}
                  >
                    <StatusBar style="light" />
                    <RootNavigator />
                  </NavigationContainer>
                </ToastProvider>
              </TabChromeProvider>
            </AppScrollProvider>
          </BalanceVisibilityProvider>
        </WatchlistProvider>
      </NotificationsProvider>
    </DisplayCurrencyProvider>
  );
}

export default function App() {
  useFonts({
    'Satoshi-Regular': require('./assets/fonts/Satoshi-Regular.otf'),
    'Satoshi-Light':   require('./assets/fonts/Satoshi-Light.otf'),
    'Satoshi-Medium':  require('./assets/fonts/Satoshi-Medium.otf'),
    'Satoshi-Bold':    require('./assets/fonts/Satoshi-Bold.otf'),
    'Satoshi-Black':   require('./assets/fonts/Satoshi-Black.otf'),
  });

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
