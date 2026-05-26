import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { DEFAULT_WATCHLIST } from '../data/mock';

type WatchlistContextValue = {
  watchlist: Set<string>;
  isWatchlisted: (tokenId: string) => boolean;
  toggle: (tokenId: string) => void;
};

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<Set<string>>(
    () => new Set(DEFAULT_WATCHLIST),
  );

  const isWatchlisted = useCallback(
    (tokenId: string) => watchlist.has(tokenId),
    [watchlist],
  );

  const toggle = useCallback((tokenId: string) => {
    setWatchlist(prev => {
      const next = new Set(prev);
      if (next.has(tokenId)) next.delete(tokenId);
      else next.add(tokenId);
      return next;
    });
  }, []);

  return (
    <WatchlistContext.Provider value={{ watchlist, isWatchlisted, toggle }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return ctx;
}
