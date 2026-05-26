export type AccountType = 'crypto' | 'card' | 'earn' | 'loans';

export interface Account {
  type: AccountType;
  label: string;
  balance: number;
  change24h: number;
}

export interface Activity {
  id: string;
  description: string;
  amount: number;
  /** User-facing display date, e.g. "Today", "Yesterday", "Apr 4". */
  date: string;
  /**
   * ISO date (YYYY-MM-DD) for grouping / sorting. Display still uses `date`.
   * Required for the Account Statement tab's month grouping.
   */
  dateISO: string;
  type: 'receive' | 'send' | 'swap' | 'spend' | 'earn';
}

export interface InvestPosition {
  id: string;
  tokenId: string;
  symbol: string;
  strategy: string;
  value: number;
  apy: number;
  active: boolean;
}

export interface CryptoToken {
  id: string;
  name: string;
  symbol: string;
  balanceUSD: number;
  amount: number;
  change24h: number;
}

export interface PendingOrder {
  id: string;
  type: 'limit' | 'trigger' | 'auto';
  tokenId: string;
  /** Primary label, e.g. "Buy BTC @ $80,000" */
  label: string;
  /** Secondary label, e.g. "Limit order · 2 days left" */
  sublabel: string;
}

export interface PriceAlert {
  id: string;
  tokenId: string;
  condition: 'above' | 'below';
  price: number;
  /** true when the condition has been met and the alert has fired */
  triggered: boolean;
}

export interface TokenDetail {
  /** Current price (USD canonical — render via DisplayCurrency + format helpers). */
  price: number;
  change24h: number;
  /** Total market cap in USD (numeric so the formatter can scale + respect the display currency). */
  marketCapUSD: number;
  /** 24h volume in USD. */
  volume24hUSD: number;
  high24h: number;
  low24h: number;
  /** Token-denominated supply string, e.g. "19.8M BTC" — NOT a fiat value. */
  circulatingSupply: string;
  allTimeHigh: number;
  about: string;
  /** Average price at which the user bought this asset (USD canonical). */
  avgBuyPrice?: number;
  /** 20 values 0–100 representing relative price over the selected time range. */
  sparklines: Record<string, number[]>;
}
