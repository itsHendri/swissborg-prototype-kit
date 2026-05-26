/**
 * Fiat / large-number formatters shared across market surfaces.
 *
 * All fiat inputs are assumed to be **USD** (the canonical storage unit
 * in mock data — `priceUSD`, `marketCapUSD`, `balanceUSD`, etc.).
 * Callers pass the `DisplayCurrency` symbol + rate so the output
 * reflects the user's selected fiat without the raw `$` leaking out.
 */

/**
 * Compact large-number formatter — "1.6T" / "190B" / "142M" / "0.5K".
 * Returns a plain 2-digit number for values below 1,000.
 */
export function formatCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e12) return (n / 1e12).toFixed(1).replace(/\.0$/, '') + 'T';
  if (abs >= 1e9)  return (n / 1e9 ).toFixed(1).replace(/\.0$/, '') + 'B';
  if (abs >= 1e6)  return (n / 1e6 ).toFixed(1).replace(/\.0$/, '') + 'M';
  if (abs >= 1e3)  return (n / 1e3 ).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toFixed(2);
}

/**
 * Convert a USD amount to the user's display currency and prefix it
 * with the right symbol — "€78,345.32", "$1.00", etc. `opts` are
 * passed straight to `Number.toLocaleString`.
 */
export function formatFiat(
  usd: number,
  symbol: string,
  rate: number,
  opts?: Intl.NumberFormatOptions,
): string {
  return `${symbol}${(usd * rate).toLocaleString('en-US', opts)}`;
}

/**
 * Currency-aware compact formatter — "€1.5T", "$190B". Preferred for
 * market-cap and volume columns where a full number is too long.
 */
export function formatFiatCompact(usd: number, symbol: string, rate: number): string {
  return `${symbol}${formatCompact(usd * rate)}`;
}
