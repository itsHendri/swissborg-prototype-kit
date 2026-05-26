// Minimal seed data so the kit boots without external state.
// Prototypes should add their own mock layer alongside this file
// (e.g. `src/prototype/<feature>/data.ts`) instead of growing this one.

import type { CryptoToken } from '../types';

export const cryptoHoldings: CryptoToken[] = [
  { id: 'btc',  name: 'Bitcoin',  symbol: 'BTC',  balanceUSD: 18420.50, amount: 0.312,  change24h:  2.8 },
  { id: 'eth',  name: 'Ethereum', symbol: 'ETH',  balanceUSD:  5120.80, amount: 3.14,   change24h: -1.2 },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', balanceUSD:   980.12, amount: 980.12, change24h:  0.0 },
  { id: 'borg', name: 'SwissBorg', symbol: 'BORG', balanceUSD:   310.00, amount: 1200,  change24h:  5.4 },
];

export const totalBalance = cryptoHoldings.reduce((sum, t) => sum + t.balanceUSD, 0);

export const DEFAULT_WATCHLIST: string[] = ['btc', 'eth'];
