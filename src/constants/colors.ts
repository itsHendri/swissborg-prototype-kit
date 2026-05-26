/**
 * SwissBorg Color Tokens — two-tier system.
 *
 * PRIMITIVES are raw hex values. They are the only place raw hex should appear
 * in the codebase. Do NOT import `PRIMITIVES` in UI code.
 *
 * COLORS are semantic tokens. All UI must reference these by name.
 *
 * Tailwind colours (`tailwind.config.js`) are generated from this same
 * primitive pool so TS and Tailwind cannot drift.
 *
 * Full visual spec, usage rules, and anti-patterns live in DESIGN_SYSTEM.md.
 */

// ─── Tier 1 · Primitives ────────────────────────────────────────────────────

const PRIMITIVES = {
  // Brand greens (darkest → lightest → brand accent)
  green900:  '#06120C',
  green800:  '#0E1A14',
  green700:  '#1A3226',
  green600:  '#243529',
  green500:  '#01C38D',
  nearBlack: '#0B0C10',   // text-on-accent contrast (slightly darker than background)

  // Neutrals
  line:      '#1D2B23',   // row dividers, card borders
  selection: '#2C3A30',   // neutral-active state for chips/tabs/segment controls (warm green-grey, not blue)

  // Foreground
  white:     '#FFFFFF',
  grey400:   '#8A9E97',

  // Signal colours
  red400:    '#FF5C5C',   // destructive, negative P&L, sell
  orange400: '#F7931A',   // warning, LTV monitor state
  purple400: '#7C6FE5',   // notification badges
  blue400:   '#4B9EFF',   // info links (Terms of Use, etc.)

  // Inputs
  placeholder: '#3A3F55',
} as const;

// ─── Tier 2 · Semantic tokens ───────────────────────────────────────────────

/**
 * Use these everywhere in UI code. Never reference `PRIMITIVES` or raw hex
 * directly from a component or screen.
 */
export const COLORS = {
  // Surfaces
  background:      PRIMITIVES.green900,   // screen / page background
  surface:         PRIMITIVES.green800,   // cards, inputs, list containers (low-contrast on bg — sits quietly)
  surfaceDeep:     PRIMITIVES.green800,   // featured / premium cards — same fill as `surface`; distinction comes from the bezel glow + lift shadow on `Card variant="deep"`
  iconBg:          PRIMITIVES.green600,   // 36x36 list icon circles

  // Foreground
  foreground:      PRIMITIVES.white,      // headings, body text
  foregroundMuted: PRIMITIVES.grey400,    // labels, metadata, secondary text
  onAccent:        PRIMITIVES.nearBlack,  // text / icon on accent-green CTAs (contrast)

  // Signal
  accent:          PRIMITIVES.green500,   // primary CTA, positive values, active dots
  destructive:     PRIMITIVES.red400,     // errors, negative P&L, sell
  warning:         PRIMITIVES.orange400,  // LTV warning, amber banners
  info:            PRIMITIVES.blue400,    // Terms-of-Use links, info banners
  badge:           PRIMITIVES.purple400,  // notification dots

  // Structural
  divider:         PRIMITIVES.line,       // row separators, card borders
  placeholder:     PRIMITIVES.placeholder,// input placeholder text, empty icons

  // Selection / neutral-active (chips, tabs, segment controls)
  selectionBg:     PRIMITIVES.selection,
  selectionBorder: 'rgba(255,255,255,0.12)',
} as const;

export type ColorKey = keyof typeof COLORS;

/**
 * Primitives are exported only for the Tailwind generator (`tailwind.config.js`).
 * Do NOT import this into runtime UI code — use `COLORS` instead.
 *
 * @internal
 */
export const _PRIMITIVES = PRIMITIVES;
