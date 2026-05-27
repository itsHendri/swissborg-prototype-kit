# SwissBorg Wallet — Design System

React Native + Expo · iOS-first · NativeWind v4 + inline styles

This file is the **single source of truth for all visual decisions**.
Before producing any UI output, read this file in full.

> **CORE RULE.** Never introduce a value, component, or pattern not defined here
> without flagging it first. Never hallucinate a component name. If something
> doesn't exist in the registry below, say so and ask before building.

Engineering conventions (architecture, state, navigation, mock data, worktree
workflow) live in `CLAUDE.md`.

---

## Grid & Spacing

Base unit: **8 pt**. All spacing must be a multiple of 4.
Valid values: `4, 8, 12, 16, 20, 24, 32, 48, 64`.
No odd numbers. No magic numbers in components — always reference by name.

Defined in `src/constants/spacing.ts`:

```ts
SPACING.xs    =  4
SPACING.sm    =  8
SPACING.md    = 12
SPACING.lg    = 16
SPACING.xl    = 20   // default screen edge padding
SPACING['2xl'] = 24
SPACING['3xl'] = 32
SPACING['4xl'] = 48
SPACING['5xl'] = 64
```

Tailwind equivalents: `gap-lg`, `p-xl`, `mt-2xl` etc. — names match the TS
tokens, sourced from the same pool in `tailwind.config.js`.

**Rules of thumb**
- Use `gap` (not `margin`) for sibling spacing wherever flex supports it.
- Vary spacing to create hierarchy. Don't apply the same padding to every
  element — extra space above a heading signals importance.
- Default **screen edge padding** is `SPACING.xl` (20). Tight layouts may
  use `SPACING.lg` (16).
- **Section gap** between cards / grouped sections is `SPACING.xl` (20).
- **Inner card padding** is `SPACING.lg` (16), or `SPACING.md` (12) compact.
- **List row** vertical padding is `12` — never 14.
- **Min tap target**: 44×44 on any interactive element.

---

## Corner Radius

Defined in `src/constants/ui.ts`:

```ts
RADIUS.sm   =   4    // tags, chips, small badges
RADIUS.md   =   8    // inputs, inline elements
RADIUS.card =  12    // cards, section containers, list groups  ← standard
RADIUS.lg   =  16    // sheets, modals, large panels
RADIUS.pill =  20    // pill chips, header nav buttons, rounded CTAs
RADIUS.xl   =  24    // hero surfaces (debit card face)
RADIUS.full = 999    // avatars, icon circles, indicator dots
```

Non-card elements (avatars, pills, CTA buttons, dots, dots) use whichever
radius fits their shape — typically `full`.

`CARD_RADIUS` is a deprecated alias for `RADIUS.card` — do not use in new code.

---

## Colors

Two-tier system. Raw hex appears in **exactly one place**: the primitives
block in `src/constants/colors.ts`. All UI references the semantic tokens.

### Primitives (never reference directly in UI)

```ts
green900  = #0B1C14     // darkest brand green
green800  = #14221B
green700  = #1A3226
green600  = #243529
green500  = #00A377     // brand accent
line      = #1D2B23     // dividers
selection = #252836     // neutral-active for chips / tabs
white     = #FFFFFF
grey400   = #8A9E97
red400    = #FF5C5C
orange400 = #F7931A
purple400 = #7C6FE5
blue400   = #4B9EFF
placeholder = #3A3F55
```

### Semantic tokens (use these everywhere)

```ts
COLORS.background      → green900    // screen / page background
COLORS.surface         → green800    // cards, inputs, list containers
COLORS.surfaceDeep     → green700    // featured / elevated cards
COLORS.iconBg          → green600    // 36×36 list icon circles

COLORS.foreground      → white       // headings, body
COLORS.foregroundMuted → grey400     // labels, metadata, secondary text
COLORS.onAccent        → nearBlack   // text / icon on accent-green CTAs

COLORS.accent          → green500    // primary CTA, positive values, active dots
COLORS.destructive     → red400      // errors, negative P&L, sell
COLORS.warning         → orange400   // LTV warning, amber banners
COLORS.info            → blue400     // Terms-of-Use links, info banners
COLORS.badge           → purple400   // notification dots

COLORS.divider         → line        // row separators, card borders
COLORS.placeholder     → placeholder // input placeholder text

COLORS.selectionBg     → selection             // active chip / tab background
COLORS.selectionBorder → rgba(255,255,255,.12) // active chip / tab border
```

### Neutral-active (chips, tabs, segment controls)

Selection is **never** the brand green. It is:

```
background: COLORS.selectionBg       // #252836
border:     COLORS.selectionBorder   // rgba(255,255,255,0.12), 1pt
text:       COLORS.foreground
```

Inactive:

```
background: COLORS.surface
border:     transparent
text:       COLORS.foregroundMuted
```

Brand green (`COLORS.accent`) is reserved for: **primary CTA buttons, positive
P&L values, active indicator dots**. Nothing else.

### Color anti-patterns — never do these

- ✗ Grey text on a colored background — use a tint of the background instead.
- ✗ Pure black or pure white — always tint toward the brand hue
  (`COLORS.background` not `#000`).
- ✗ `backgroundClip: text` gradient text — solid color only.
- ✗ Border-left/right accent stripes wider than 1pt on cards or rows — this
  is the most overused AI design pattern and looks unintentional. Use
  background tints or icons instead.
- ✗ Cyan-on-dark, purple→blue gradients, neon glow accents — AI tells.

---

## Typography

Defined in `src/constants/typography.ts`. Every style includes `fontSize`,
`fontWeight`, `lineHeight`, and `letterSpacing`. Never hardcode a font size,
weight, or line-height in a component — always reference `typography.*`.

Scale (points):

```
displayLarge  36 / Bold      42 lh    -0.5 ls   hero numbers
display       32 / Bold      38 lh    -0.4 ls   prominent balances
headingLarge  28 / Bold      34 lh    -0.3 ls   screen hero titles
heading       24 / Bold      30 lh    -0.3 ls   screen titles
titleLarge    22 / Bold      28 lh    -0.2 ls
title         20 / Bold      26 lh    -0.2 ls   section / modal titles
titleSmall    18 / Semibold  24 lh    -0.1 ls
subtitle      16 / Semibold  22 lh     0   ls   card names, list primary
body          14 / Regular   20 lh     0   ls   standard body
bodyMedium    14 / Medium    20 lh     0   ls   list primary labels
bodySemibold  14 / Semibold  20 lh     0   ls   list row values, emphasis
bodyBold      14 / Bold      20 lh     0   ls
label         12 / Regular   16 lh    +0.3 ls   metadata, secondary
labelSemibold 12 / Semibold  16 lh    +0.3 ls
labelBold     12 / Bold      16 lh    +0.3 ls
caption       10 / Semibold  14 lh    +0.2 ls   badges, micro labels
```

**Rules**
- Use fewer sizes with larger contrast. A 5-step scale at ≥1.25× creates
  clearer hierarchy than eight sizes only 1.1× apart.
- Max line length for body text: ~65–75 chars — add a `maxWidth` constraint
  on blocks of prose.

### Typography anti-patterns

- ✗ Flat hierarchy where sizes are too close (< 1.25× ratio).
- ✗ All-caps for long body passages — reserve for short labels only.
- ✗ Mixing `fontSize: n, fontWeight: 'x'` inline with `typography.*`. Pick one.

---

## Motion

- Use React Native's built-in `Animated` API (`import { Animated } from 'react-native'`).
- `react-native-reanimated` is installed but not used directly — it patches
  RN's `Animated` natively.
- Reanimated strict mode is disabled in `App.tsx` to suppress false-positive
  warnings from React Navigation internals. Log level is `error`.
- Never write `style={{ opacity: someValue.value }}` — pass the animated node
  directly.
- **Seamless loops**: use 4-step sequences (0 → +1 → 0 → −1 → 0) so
  `Animated.loop` restarts at the initial value without a visible jump.
- **Mixing `setValue()` with loops**: always use `useNativeDriver: false` —
  native driver does not support imperative `setValue()` calls.
- Never animate layout properties (width, height, padding, margin) — use
  `transform` and `opacity` instead.

---

## Component Registry

Canonical list of approved components. Before building any UI:

1. Check if one of these covers the need.
2. If yes — use it; extend it if needed; do not rebuild.
3. If no — **flag, name, add here before writing code**.

Only extract a pattern into a component when it appears 3+ times with the
same intent. Premature abstraction is worse than duplication.

### Atoms

| Name         | Path                                     | Notes                                                              |
|--------------|------------------------------------------|--------------------------------------------------------------------|
| `Button`     | `src/components/shared/Button.tsx`       | `size`: sm/md/lg · `variant`: primary/secondary/ghost · `fullWidth`, `leftIcon`, `rightIcon` |
| `Badge`      | `src/components/shared/Badge.tsx`        | `tone`: neutral/success/danger/info/badge/warning/dev · `size`: tag/pill/chip |
| `TextField`  | `src/components/shared/TextField.tsx`    | Surface bg · `label`, `helper`, `error`, `leadingIcon`, `size`: default/display/search |
| `IconCircle` | `src/components/shared/IconCircle.tsx`   | 36×36 `COLORS.iconBg` circle · `icon` Ionicon or `children`        |
| `CryptoIcon` | `src/components/shared/CryptoIcon.tsx`   | Token avatar with colour ring + initials fallback · list rows use `size={36}` |
| `GlassIcon`  | `src/components/shared/GlassIcon.tsx`    | Branded green-glass PNG · `name` from static map · standard size `100` |
| `PremiumIcon`| `src/components/shared/PremiumIcon.tsx`  | Large-format illustrated PNG for hero / empty-state / story surfaces · `name` from static map · standard size `160` |
| `GlassNavButton` | `src/components/shared/GlassNavButton.tsx` | 36×36 glass button · used for back/close in `PageTitleBar` and success screens |
| `Switch`     | `src/components/shared/Switch.tsx`       | iOS-style on/off toggle (51×31 — single size for accessibility) · accent track when on · pair with `ListRow` trailing slot |
| `PercentChange` | `src/components/shared/PercentChange.tsx` | Signed % with directional color + arrow · `variant`: text/pill · `size`: sm/md · `arrow`, `precision` |
| `ProgressBar` | `src/components/shared/ProgressBar.tsx`  | Linear determinate progress (0–1) · `tone`: accent/warning/destructive/info · `size`: sm/md/lg · optional `label` + `trailingLabel` |

### Molecules

| Name          | Path                                      | Notes                                                           |
|---------------|-------------------------------------------|-----------------------------------------------------------------|
| `ListRow`     | `src/components/shared/ListRow.tsx`       | Canonical list row · leading + primary + secondary + value/sublabel OR `trailing` (custom right content) · `primaryWeight` for nav rows · never recreated inline |
| `SectionHeader` | `src/components/shared/SectionHeader.tsx` | Section title + optional action link · **sits outside the card it heads** |
| `FilterChip`  | `src/components/shared/FilterChip.tsx`    | Neutral-active chip · never accent green                        |
| `PagerDots`   | `src/components/shared/PagerDots.tsx`     | Active 16×6 / inactive 6×6 dot indicator                        |
| `ShortcutButton` | `src/components/shared/ShortcutButton.tsx` | Icon + label action button                                    |
| `OtpInput`    | `src/components/shared/OtpInput.tsx`      | N-digit code input · numeric keyboard · auto-advance · paste-aware · `length` (default 6), `onComplete`, `error` |
| `AmountInput` | `src/components/shared/AmountInput.tsx`   | Hero numeric field · `symbol` + `symbolPosition` · optional `onMax` button + `onToggleCurrency` (fiat ↔ crypto) |
| `UploadTile`  | `src/components/shared/UploadTile.tsx`    | KYC document upload affordance · `status`: empty/uploaded/error · mock-only (no real file picker) |
| `Stepper`     | `src/components/shared/Stepper.tsx`       | Horizontal numbered progress · `current`/`total`/`labels?` · `variant`: numbered/compact · distinct from `PagerDots` (labeled and ordered) |
| `Accordion`   | `src/components/shared/Accordion.tsx`     | Collapsible section · chevron rotate · `LayoutAnimation` body reveal · nest inside `<Card padding="rows">` |
| `TimeRangePicker` | `src/components/shared/TimeRangePicker.tsx` | Segmented pill row for chart ranges (`1H · 1D · 1W · 1M · 1Y · All`) · single 32h size for tap-target accessibility · fires `useHaptic('selection')` on change · denser than `TabSwitcher` |

### Organisms

| Name           | Path                                        | Notes                                                          |
|----------------|---------------------------------------------|----------------------------------------------------------------|
| `Card`         | `src/components/shared/Card.tsx`            | Surface container at `RADIUS.card` · `variant`: surface/deep · `padding`: rows/all/none · `noMargin` · **never nest** |
| `SummaryCard`  | `src/components/shared/SummaryCard.tsx`     | Vertical stack of label/value rows · used for borrow confirms, loan details, order summaries |
| `InfoCard`     | `src/components/shared/InfoCard.tsx`        | Icon square + title + body · used on terms / risk screens      |
| `SuccessScreen`| `src/components/shared/SuccessScreen.tsx`   | **Unified success template.** ShimmerGrid bg + centred checkmark + title + optional amount + body + optional summary/info card. `loading` swaps checkmark for spinner. Use for EVERY success state. |
| `EmptyState`   | `src/components/shared/EmptyState.tsx`      | Icon + title + subtitle + optional CTA · `variant`: default/compact |
| `PageTitleBar` | `src/components/shared/PageTitleBar.tsx`    | Sticky frosted header · `variant`: push/modal · `hideBack`, `scrollY`, `rightActions` |
| `StickyBottomBar` | `src/components/shared/StickyBottomBar.tsx` | Safe-area-aware action bar for detail screens                |
| `TabSwitcher`  | `src/components/shared/TabSwitcher.tsx`     | Horizontal pill tab bar · `scrollable`, `compact`              |
| `BottomSheet`  | `src/components/shared/BottomSheet.tsx`     | Generic option-picker modal · slide-up, scrim dismiss          |
| `ShimmerGrid`  | `src/components/shared/ShimmerGrid.tsx`     | Ambient dot-grid background · `pointerEvents="none"` · place first child of container |
| `ScreenGradient` | `src/components/shared/ScreenGradient.tsx` | Full-screen background gradient                               |
| `QuoteCard`    | `src/components/shared/QuoteCard.tsx`       | Trade / swap confirmation summary · `from` + `to` sides + `meta` rows (rate/fee/slippage) · arrow in the middle |
| `StatusTimeline` | `src/components/shared/StatusTimeline.tsx` | Vertical step list with `current` (0-indexed) · done/active/upcoming states · for transactions, KYC |
| `Toast`        | `src/components/shared/Toast.tsx` + `src/context/ToastContext.tsx` | Imperative ephemeral notification — `useToast()` hook · tones: success/error/info/warning · auto-dismiss · stack newest on top |
| `LineChart`    | `src/components/shared/LineChart.tsx`       | Time-series chart via `react-native-svg` · `variant`: sparkline (no axes) / interactive (touch crosshair + readout) · optional `area` gradient · `tone`: accent/destructive/warning/info/foreground · `onPointerChange(point)` for hero-balance hover state |
| `HeroBalance`  | `src/components/shared/HeroBalance.tsx`     | Composite top-of-screen balance · `displayLarge` value + `PercentChange` + period · eye toggle wired to `BalanceVisibilityContext` · `align`: center/left |
| `DevKitSection` | `src/components/shared/DevKitSection.tsx`  | Wrapper used **only** by `StylesScreen` — labelled section with `filter` and optional `api`/`caption`. Never render outside the Dev Kit. |

### Charts & numbers

- Use `LineChart` for any time-series. Prefer the `sparkline` variant
  inside list rows + dense cards (height ≤ 60); use the default
  `interactive` variant for hero/portfolio surfaces and feed
  `onPointerChange` into the `HeroBalance` value to show the touched
  price.
- Use `PercentChange` (already an atom) inline in `HeroBalance` and
  inside `ListRow`'s trailing slot — never reimplement the signed
  formatting / colour rule.
- Use `ProgressBar` for any 0–1 progress (KYC, staking lockup,
  onboarding). For a labelled multi-step funnel, prefer `Stepper`.
- `BalanceVisibilityContext` is global: any surface rendering a money
  string should call `useBalanceVisible()` + `formatBalance(value,
  visible)` so the eye toggle works end-to-end. Don't reimplement local
  show/hide state.

### Hooks

- `useHaptic(boundKind?)` — wrapper over `expo-haptics`. Tap targets
  use `'selection'`; success states (`SwipeToConfirm` complete, EAS
  publish) use `'success'`; destructive confirms use `'impactHeavy'`.
  No-ops on web. Source: `src/hooks/useHaptic.ts`.

### Feature-specific — Loans

| Name           | Path                                          | Notes                                                          |
|----------------|-----------------------------------------------|----------------------------------------------------------------|
| `LTVGauge`     | `src/components/loans/LTVGauge.tsx`           | Segmented bar with zones + marker at current LTV              |
| `LoanHealthBanner` | `src/components/loans/LoanHealthBanner.tsx` | Amber/red alert when LTV ≥ 70 / 80                         |
| `LoanAccountCard` | `src/components/loans/LoanAccountCard.tsx`  | Portfolio carousel card · 3 states (not-setup / ready / active) |

Feature-specific components live under `src/components/<feature>/`. If a
feature-specific component gets reused in a second feature, promote it to
`src/components/shared/`.

### List row invariants (enforced by `ListRow`)

- `paddingVertical: 12` — never 14.
- Divider `COLORS.divider` bottom border, suppressed on `last`.
- Primary: `typography.bodyMedium` (use `primaryWeight="semibold"` for
  navigation / action rows). Secondary: `typography.label` + `marginTop: 2`.
- Value: `typography.bodySemibold`.
- No chevron by default. For navigation rows, pass a
  `trailing={<MenuTrailing />}` that includes the chevron explicitly —
  `trailing` replaces the value/sublabel stack.
- **Never use NativeWind `text-sm` / `text-xs` on list items** — they have
  constrained line-heights that fight the row rhythm.

### Section header pattern

Section titles sit **outside** their card containers — rendered directly in
the parent, not inside the card `<View>`:

```tsx
<SectionHeader title="Action items" actionLabel="See all" onAction={...} />
<Card>
  {rows}
</Card>
```

### Inward-glow / bezel pattern

Used on allocation bars, LTV gauges, progress bars, the debit card face.
Three absolutely-positioned border rings inside `overflow: hidden`:

```tsx
<View style={{ borderRadius: 4, overflow: 'hidden', backgroundColor: color }}>
  <View pointerEvents="none" style={{ position: 'absolute', inset: 0, borderRadius: 4, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.65)' }} />
  <View pointerEvents="none" style={{ position: 'absolute', inset: 1, borderRadius: 3, borderWidth: 1,   borderColor: 'rgba(255,255,255,0.18)' }} />
  <View pointerEvents="none" style={{ position: 'absolute', inset: 2, borderRadius: 2, borderWidth: 1,   borderColor: 'rgba(255,255,255,0.07)' }} />
</View>
```

---

## Layout anti-patterns

- ✗ Wrapping everything in cards — not everything needs a container.
- ✗ Nesting cards inside cards — flatten the hierarchy.
- ✗ Centre-aligning everything — left-aligned text with asymmetric layouts
  reads as more intentional.
- ✗ Identical card grids (same icon + heading + body, repeated N times).
- ✗ Same padding on every element — vary spacing to create rhythm.
- ✗ Section titles inside card padding — they sit outside.
- ✗ Modals as the default solution for secondary content — find an alternative.

---

## Component Creation Rules

Before building **any** UI, run through this checklist. It exists to keep the
component tree shallow, the design tokens authoritative, and the dev Kit
preview honest.

### 1. Don't build it if it already exists

Every shared component is listed in the **Component Registry** above and
previewed on the **Dev Kit** screen (`src/screens/StylesScreen.tsx`).

Before writing new JSX, scan the registry:

```text
Atoms:       Button · Badge · TextField · IconCircle · CryptoIcon · GlassIcon · PremiumIcon · GlassNavButton
Molecules:   ListRow · SectionHeader · FilterChip · PagerDots · ShortcutButton
Organisms:   Card · SummaryCard · InfoCard · SuccessScreen · EmptyState
             PageTitleBar · StickyBottomBar · TabSwitcher · BottomSheet · ShimmerGrid · ScreenGradient
```

If one of these covers the need — **use it**. If it almost covers the need,
extend the existing component with a new prop (e.g. `ListRow.trailing`
was added to support menu-row chevrons without a separate MenuRow
component).

**Three-strike rule**: only extract a new shared component when the same
pattern appears 3+ times with the same intent. Two copies is a coincidence.
Premature abstraction is worse than duplication.

### 2. Tokens first, always

Never hardcode a visual value. Every screen and component must pull from:

```ts
import { COLORS }            from '../constants/colors';
import { SPACING }           from '../constants/spacing';
import { RADIUS }            from '../constants/ui';
import { typography, FONT_SIZE } from '../constants/typography';
```

**Banned in component code:**

- Raw hex literals (`#00A377`, `rgba(0,163,119,...)` that matches a token)
- Inline `fontSize: N` / `fontWeight: 'X'` when a `typography.*` preset matches
- Inline `borderRadius: N` when a `RADIUS.*` token matches
- Raw spacing literals (`paddingHorizontal: 20`, `gap: 12`) — always
  `SPACING.*`
- NativeWind classes that bypass the token map (`text-[#fff]`, `p-[13px]`)

**When is a raw hex acceptable?**

- Token brand colours inside `CryptoIcon`'s TOKEN_COLORS map (BTC orange,
  ETH blue, SOL purple, etc. — those are external brand assets, not our
  design system)
- Tinted signal overlays like `rgba(255,92,92,0.14)` derived from
  `COLORS.destructive`
- Intentional bezel-ring overlay colours (`rgba(255,255,255,0.65)` etc.)
- Loyalty-tier brand colours (the Gold-tier `#F5AC37` in ProfileScreen)
- Chart grid overlays at explicit alpha (`rgba(255,255,255,0.15)`)

In every one of these cases, leave a one-line comment explaining why the
hex isn't tokenised.

**When a value is off-scale**

Snap to the closest canonical `SPACING.*` / `RADIUS.*` value unless the
layout genuinely requires a non-standard increment. For in-between values
(e.g. 6, 10, 14, 18), use:

```ts
padding: SPACING.xs + 2,    // 6
padding: SPACING.sm + 2,    // 10
padding: SPACING.md + 2,    // 14
padding: SPACING.lg + 2,    // 18
```

…with the numeric value in a trailing comment so grep still finds it.

### 3. Extend before duplicating

If the shared component is 80% of what you need but missing one prop, add
the prop. Don't build a parallel component.

Good recent examples:

- **`ListRow.trailing?: ReactNode`** — added when ProfileScreen needed
  chevron + badge affordances. No MenuRow component needed.
- **`PageTitleBar.hideBack?: boolean`** — added when success screens
  wanted no back button without rebuilding the header.
- **`SuccessScreen.loading?: boolean`** — absorbs the in-flight processing
  state into the same component, not a separate ProcessingStep.

Extension guidelines:

- The new prop must have a sensible default that preserves existing
  behaviour — no regressions in call sites that don't pass it.
- Mutually exclusive props get a comment noting the conflict (e.g.
  "when `trailing` is provided, `value`/`sublabel` are ignored").
- Update the Dev Kit preview in `StylesScreen.tsx` so the new variant
  is visible on the preview screen.

### 4. Feature-specific components live under `src/components/<feature>/`

- Use `shared/` only for patterns reused across 2+ features.
- Loans-specific widgets (`LTVGauge`, `LoanHealthBanner`,
  `LoanAccountCard`) stay in `components/loans/`.
- If a feature-specific component gets adopted by a second feature,
  promote it to `shared/` in the same change — don't let it live in two
  places.

### 5. Edit the source, not the preview

`StylesScreen` imports the *real* shared components — it is NOT a parallel
implementation. This means:

- Fixing a bug in `Button` fixes both the app and the preview.
- Any visual regression in the preview is a real regression in the app.
- Previews are auto-generated from the exported tokens (`COLORS`,
  `SPACING`, `RADIUS`, `typography`) so the preview can't drift from the
  source of truth.

If you add a new token or component, add a preview section to
`StylesScreen` so the next engineer (or agent) can see it.

### 6. When you genuinely need something new

Before creating a file in `src/components/shared/`:

1. **Stop.**
2. State what the new component does and what slot it fills in the
   registry tier (atom / molecule / organism).
3. Show that at least 3 existing call sites would adopt it.
4. Verify no existing component can be extended to cover the need.
5. Add an entry to the **Component Registry** table above in the same
   commit.
6. Add a preview block in `StylesScreen.tsx`.
7. Make sure the new component consumes `COLORS`, `SPACING`, `RADIUS`,
   and `typography` exclusively — no raw values.

---

## Hallucination Guard

If you are about to use a component, token, style name, or spacing value
that is **not** defined in this document:

1. **Stop.**
2. Say: *"This doesn't exist in the design system yet: [name]."*
3. Propose a definition and where it belongs in the registry.
4. Wait for approval before writing code.

Do not silently invent values. Do not approximate. Do not alias an existing
component under a new name. Ask.

---

## Source of truth — files

| Concern          | File                                      |
|------------------|-------------------------------------------|
| Spacing scale    | `src/constants/spacing.ts`                |
| Radius scale     | `src/constants/ui.ts`                     |
| Color tokens     | `src/constants/colors.ts`                 |
| Type scale       | `src/constants/typography.ts`             |
| Tailwind mirror  | `tailwind.config.js` (generated from above) |
| Shared components | `src/components/shared/`                 |
