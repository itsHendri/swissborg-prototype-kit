import React, { createContext, useContext, useRef } from 'react';
import { Animated } from 'react-native';

type AppScrollContextType = {
  scrollY: Animated.Value;
};

const AppScrollContext = createContext<AppScrollContextType>({
  scrollY: new Animated.Value(0),
});

/**
 * Provides a single shared scrollY Animated.Value that tab screens write to.
 * MainLayout reads it to fade the AppHeader blur in on scroll.
 */
export function AppScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  return (
    <AppScrollContext.Provider value={{ scrollY }}>
      {children}
    </AppScrollContext.Provider>
  );
}

export const useAppScroll = () => useContext(AppScrollContext);
