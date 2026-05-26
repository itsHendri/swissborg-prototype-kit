import React, { createContext, useContext, useState, useCallback } from 'react';

type TabChromeContextType = {
  /** When `true`, MainLayout suppresses its floating AppHeader + scroll blur. */
  hideAppHeader: boolean;
  setHideAppHeader: (hide: boolean) => void;
};

const TabChromeContext = createContext<TabChromeContextType>({
  hideAppHeader: false,
  setHideAppHeader: () => {},
});

/**
 * Lets tab screens opt out of the shared floating AppHeader. Today only
 * the Trade tab uses this — its order-type tabs need to sit flush with
 * the safe-area top so the screen reads as a focused trading surface,
 * not a dashboard with a header overlay.
 *
 * Pattern: call `useTabChrome().setHideAppHeader(true)` from `useFocusEffect`
 * and return `false` on blur so the flag stays in sync with navigation.
 */
export function TabChromeProvider({ children }: { children: React.ReactNode }) {
  const [hideAppHeader, setHideAppHeaderState] = useState(false);
  const setHideAppHeader = useCallback((hide: boolean) => {
    setHideAppHeaderState(hide);
  }, []);
  return (
    <TabChromeContext.Provider value={{ hideAppHeader, setHideAppHeader }}>
      {children}
    </TabChromeContext.Provider>
  );
}

export const useTabChrome = () => useContext(TabChromeContext);
