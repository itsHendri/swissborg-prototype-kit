/**
 * Tailwind / NativeWind config — color and spacing scales are sourced from
 * the same primitive pool as `src/constants/colors.ts` and
 * `src/constants/spacing.ts` so TS and Tailwind cannot drift.
 *
 * When adding a new token:
 *   1. Add the primitive in src/constants/colors.ts (PRIMITIVES).
 *   2. Expose a semantic name in COLORS.
 *   3. Add the class alias here.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Surfaces
        background:  '#06120C',
        surface:     '#0E1A14',
        'surface-deep': '#0E1A14',
        'icon-bg':   '#243529',

        // Foreground
        foreground:  '#FFFFFF',
        muted:       '#8A9E97',
        'on-accent': '#0B0C10',

        // Signal
        accent:      '#01C38D',
        destructive: '#FF5C5C',
        warning:     '#F7931A',
        info:        '#4B9EFF',
        badge:       '#7C6FE5',

        // Structural
        line:        '#1D2B23',   // kept as `line` for existing `border-line` usages
        divider:     '#1D2B23',   // semantic alias
        placeholder: '#3A3F55',

        // Selection / neutral-active
        selection:   '#252836',
      },
      spacing: {
        // Mirrors src/constants/spacing.ts
        xs:    '4px',
        sm:    '8px',
        md:    '12px',
        lg:    '16px',
        xl:    '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '48px',
        '5xl': '64px',
      },
      borderRadius: {
        // Mirrors src/constants/ui.ts RADIUS
        sm:   '4px',
        md:   '8px',
        card: '12px',
        lg:   '16px',
        pill: '20px',
        xl:   '24px',
        full: '999px',
      },
      fontFamily: {
        'satoshi':        ['Satoshi-Regular'],
        'satoshi-light':  ['Satoshi-Light'],
        'satoshi-medium': ['Satoshi-Medium'],
        'satoshi-bold':   ['Satoshi-Bold'],
        'satoshi-black':  ['Satoshi-Black'],
      },
    },
  },
  plugins: [],
};
