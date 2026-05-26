/**
 * SwissBorg Spacing Tokens
 *
 * All spacing (padding, margin, gap, size) must be drawn from this scale.
 * Multiples of 4, aligned to the 8-point grid. No odd numbers. No magic
 * numbers inline — always reference by name.
 *
 *   SPACING.xs   →  4
 *   SPACING.sm   →  8
 *   SPACING.md   →  12
 *   SPACING.lg   →  16
 *   SPACING.xl   →  20   ← default screen edge padding
 *   SPACING['2xl'] → 24
 *   SPACING['3xl'] → 32
 *   SPACING['4xl'] → 48
 *   SPACING['5xl'] → 64
 *
 * The spec-level visual rules (when to use which step, section rhythm,
 * card padding, list row padding) live in DESIGN_SYSTEM.md.
 */
export const SPACING = {
  xs:    4,
  sm:    8,
  md:    12,
  lg:    16,
  xl:    20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
  '5xl': 64,
} as const;

export type SpacingKey = keyof typeof SPACING;
