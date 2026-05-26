/**
 * SwissBorg Radius Tokens
 *
 * All border-radius values in the app must come from this scale.
 *
 *   RADIUS.sm    →  4    tags, chips, small badges
 *   RADIUS.md    →  8    inputs, inline elements
 *   RADIUS.card  →  12   cards, section containers, list groups ← standard
 *   RADIUS.lg    →  16   sheets, modals, large panels
 *   RADIUS.pill  →  20   pill chips, header nav buttons, rounded CTAs
 *   RADIUS.xl    →  24   hero surfaces (debit card face)
 *   RADIUS.full  →  999  avatars, icon circles, indicator dots
 *
 * Non-card elements (avatars, pill buttons, badges, dots) use whichever
 * radius fits their shape — typically `full`.
 */
export const RADIUS = {
  sm:   4,
  md:   8,
  card: 12,
  lg:   16,
  pill: 20,
  xl:   24,
  full: 999,
} as const;

export type RadiusKey = keyof typeof RADIUS;

/**
 * @deprecated Import `RADIUS.card` instead. Kept as an alias so the existing
 * call sites continue to compile while they migrate.
 */
export const CARD_RADIUS = RADIUS.card;
