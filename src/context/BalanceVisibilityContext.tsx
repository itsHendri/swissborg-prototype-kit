import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/**
 * App-wide hide/show toggle for monetary values. Pair with the eye toggle
 * on `<HeroBalance />` (or any other surface) so the user can mask their
 * balance at a glance.
 *
 * Use the hook anywhere a numeric value is rendered:
 *
 *   const { visible } = useBalanceVisible();
 *   <Text>{formatBalance('€12,480.00', visible)}</Text>
 *
 * For a single string-level mask there's also the helper export
 * `formatBalance` which swaps the value out for a row of bullets while
 * keeping the prefix (currency symbol or `≈`) so layouts don't reflow.
 */

type Ctx = {
  visible: boolean;
  setVisible: (next: boolean) => void;
  toggle: () => void;
};

const BalanceVisibilityContext = createContext<Ctx | undefined>(undefined);

export function BalanceVisibilityProvider({
  children,
  defaultVisible = true,
}: {
  children: ReactNode;
  defaultVisible?: boolean;
}) {
  const [visible, setVisible] = useState(defaultVisible);
  const toggle = useCallback(() => setVisible(v => !v), []);
  const value = useMemo<Ctx>(() => ({ visible, setVisible, toggle }), [visible, toggle]);
  return (
    <BalanceVisibilityContext.Provider value={value}>
      {children}
    </BalanceVisibilityContext.Provider>
  );
}

export function useBalanceVisible(): Ctx {
  const ctx = useContext(BalanceVisibilityContext);
  if (!ctx) throw new Error('useBalanceVisible must be used inside <BalanceVisibilityProvider>');
  return ctx;
}

/**
 * Mask a money string while keeping leading currency / approximation
 * symbols so the layout doesn't jump. Defaults to a 6-bullet run which
 * reads consistently across `body` and `display` sizes.
 *
 *   formatBalance('€12,480.00', true)  → '€12,480.00'
 *   formatBalance('€12,480.00', false) → '€••••••'
 *   formatBalance('≈ 0.5 BTC',  false) → '≈ ••••••'
 *   formatBalance('+$1,240.00', false) → '+$••••••'
 */
export function formatBalance(raw: string, visible: boolean, mask = '••••••'): string {
  if (visible) return raw;
  // Preserve a single leading prefix run (sign, currency, approximation, space).
  const match = raw.match(/^([+\-]?\s?[≈$€£¥₿]?\s?)/);
  const prefix = match ? match[1] : '';
  return `${prefix}${mask}`;
}
