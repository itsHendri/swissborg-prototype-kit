/**
 * SwissBorg Type Scale
 *
 * All font sizes follow an 8-point grid — values are even numbers only.
 * Names follow a universally recognised hierarchy:
 *
 *   display  →  heading  →  title  →  subtitle  →  body  →  label  →  caption
 *
 * Weight modifiers: Regular (400), Medium (500), Semibold (600), Bold (700).
 *
 * Every style defines `lineHeight` (1.4–1.5× for body, 1.1–1.2× for display)
 * and `letterSpacing` (0 for body, 0.02em for label/caption) so call sites
 * do not need to hand-tune line metrics.
 *
 * Usage:
 *   import { typography, FONT_SIZE } from '../constants/typography';
 *   <Text style={[typography.body, { color: COLORS.foreground }]}>Hello</Text>
 *   <Text style={{ fontSize: FONT_SIZE.label }}>Small text</Text>
 *
 * Visual spec, when-to-use rules, and anti-patterns live in DESIGN_SYSTEM.md.
 */

import type { TextStyle } from 'react-native';

// ─── Size scale (even numbers only) ─────────────────────────────────────────

export const FONT_SIZE = {
  displayLarge: 36,
  display:      32,
  headingLarge: 28,
  heading:      24,
  titleLarge:   22,
  title:        20,
  titleSmall:   18,
  subtitle:     16,
  body:         14,
  label:        12,
  caption:      10,
} as const;

// ─── Named text styles ──────────────────────────────────────────────────────

/**
 * All styles include `lineHeight` and `letterSpacing` so spacing stays
 * consistent across the app regardless of the font family loaded.
 *
 * React Native expects `letterSpacing` in absolute points, not em. We
 * approximate the template's "0.02em for label/caption" as ~0.3pt at 12px
 * and ~0.2pt at 10px — small but perceptible, and never negative.
 */
export const typography = {
  // Display — hero numbers, portfolio balances · line-height 1.15× · tight tracking
  displayLarge:  { fontSize: 36, fontWeight: '700', lineHeight: 42, letterSpacing: -0.5 },
  display:       { fontSize: 32, fontWeight: '700', lineHeight: 38, letterSpacing: -0.4 },

  // Heading — prominent section headings · 1.2×
  headingLarge:  { fontSize: 28, fontWeight: '700', lineHeight: 34, letterSpacing: -0.3 },
  heading:       { fontSize: 24, fontWeight: '700', lineHeight: 30, letterSpacing: -0.3 },

  // Title — page headers, structural headings · 1.2×
  titleLarge:    { fontSize: 22, fontWeight: '700', lineHeight: 28, letterSpacing: -0.2 },
  title:         { fontSize: 20, fontWeight: '700', lineHeight: 26, letterSpacing: -0.2 },
  titleSmall:    { fontSize: 18, fontWeight: '600', lineHeight: 24, letterSpacing: -0.1 },

  // Subtitle — card names, list item primary text · 1.4×
  subtitle:      { fontSize: 16, fontWeight: '600', lineHeight: 22, letterSpacing: 0 },

  // Body — standard readable content · 1.5×
  body:          { fontSize: 14, fontWeight: '400', lineHeight: 20, letterSpacing: 0 },
  bodyMedium:    { fontSize: 14, fontWeight: '500', lineHeight: 20, letterSpacing: 0 },
  bodySemibold:  { fontSize: 14, fontWeight: '600', lineHeight: 20, letterSpacing: 0 },
  bodyBold:      { fontSize: 14, fontWeight: '700', lineHeight: 20, letterSpacing: 0 },

  // Label — secondary text, metadata, captions · 1.4× · slight positive tracking
  label:         { fontSize: 12, fontWeight: '400', lineHeight: 16, letterSpacing: 0.3 },
  labelSemibold: { fontSize: 12, fontWeight: '600', lineHeight: 16, letterSpacing: 0.3 },
  labelBold:     { fontSize: 12, fontWeight: '700', lineHeight: 16, letterSpacing: 0.3 },

  // Caption — badges, tags, micro labels · 1.4× · even tighter tracking
  caption:       { fontSize: 10, fontWeight: '600', lineHeight: 14, letterSpacing: 0.2 },
} as const satisfies Record<string, TextStyle>;
