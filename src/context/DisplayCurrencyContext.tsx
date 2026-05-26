import { createContext, useContext, useState, type ReactNode } from 'react';

export type DisplayCurrency = 'EUR' | 'USD' | 'GBP' | 'CHF';

/** Symbol prefix for each currency. */
const SYMBOLS: Record<DisplayCurrency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  CHF: 'CHF ',
};

/** Approximate rate vs USD (prototype — not live FX). */
const RATES: Record<DisplayCurrency, number> = {
  EUR: 0.92,
  USD: 1.00,
  GBP: 0.79,
  CHF: 0.90,
};

interface DisplayCurrencyContextValue {
  currency: DisplayCurrency;
  /** Prefix symbol: '€', '$', '£', 'CHF ' */
  symbol: string;
  /** Multiplier vs USD (use to convert USD mock prices). */
  rate: number;
  setCurrency: (c: DisplayCurrency) => void;
  /**
   * Format a USD-denominated value into the display currency.
   * e.g. fmt(83241) → "€76,581.72"
   */
  fmt: (usdValue: number, opts?: { decimals?: number }) => string;
}

const DisplayCurrencyContext = createContext<DisplayCurrencyContextValue>({
  currency: 'EUR',
  symbol: '€',
  rate: RATES.EUR,
  setCurrency: () => {},
  fmt: (v) => `€${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
});

export function DisplayCurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<DisplayCurrency>('EUR');
  const symbol = SYMBOLS[currency];
  const rate   = RATES[currency];

  const fmt = (usdValue: number, opts: { decimals?: number } = {}) => {
    const converted = usdValue * rate;
    const decimals  = opts.decimals ?? 2;
    return `${symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  return (
    <DisplayCurrencyContext.Provider value={{ currency, symbol, rate, setCurrency, fmt }}>
      {children}
    </DisplayCurrencyContext.Provider>
  );
}

export function useDisplayCurrency() {
  return useContext(DisplayCurrencyContext);
}
