# SwissBorg Prototype Kit — Project Conventions

> **This repo is a template, not a prototype container.** Each prototype
> lives in its own fork created via "Use this template". On the kit's
> `main`, the `scenarios` array in `src/prototype/scenarios.tsx` stays
> empty — that's the contract that keeps the kit light. PRs adding
> scenarios target a prototype fork, not this repo. Acceptable changes
> here: design-system tokens, shared components, scenario-system
> improvements, navigation shell, dev surfaces.

> **Visual spec:** see [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for spacing,
> colors, typography, radii, shared components, anti-patterns, and
> component-creation rules. Read it before writing any new UI.
> This file covers engineering, state, navigation, and workflow.

## Running the project

- **Canonical command: `npx expo start`** — boots Metro and waits for an
  interactive keystroke (`i` iOS Simulator, `a` Android, `w` web, `j`
  debugger, `r` reload, `m` dev menu). Always prefer this over the
  target-specific shortcuts; one Metro instance serves every target.
- The `npm run ios` / `npm run web` / `npm run android` scripts exist as
  shortcuts but skip the prompt — only suggest them if the user
  explicitly wants to jump straight to one target.
- **iOS Simulator via Expo Go is the primary preview surface.** Web is
  only for the Figma export flow (`WEB_EXPORT.md`).
- If Expo prompts "Install the recommended Expo Go version?" and the
  fetch fails, the answer is **`n`** — the default is `yes` so a bare
  Enter sends it into the failing download. The existing Expo Go on the
  Simulator is compatible with SDK 54.

## Architecture

- **React Native + Expo SDK ~54**, iOS-first, tested on Simulator via Expo Go.
- **Charts** use `react-native-svg` (already a dep) via the `LineChart`
  component — never pull in `react-native-chart-kit`, `victory-native`,
  or similar. The kit's chart story is one component with sparkline +
  interactive variants.
- **Balance visibility** is global state — wrap money values in
  `formatBalance(value, useBalanceVisible().visible)` so the eye
  toggle on `HeroBalance` masks every surface at once. Don't add local
  show/hide state.
- **Haptics** come from `useHaptic()` in `src/hooks/useHaptic.ts`.
  Use it for any interactive state change worth confirming
  ('selection' on chips/segments, 'success' on confirm,
  'impactHeavy' for destructive). No-ops on web automatically.
- **NativeWind v4** (Tailwind CSS for RN) + inline style objects.
- **React Navigation** — native-stack for screens, bottom-tabs for the main tab bar.
- Entry point: `App.tsx` → providers (`DisplayCurrency`, `Notifications`,
  `Watchlist`, `AppScroll`, `Theme`) → `NavigationContainer` →
  `RootNavigator` → `TabNavigator` + Profile/Theme/Styles stack screens.
- Design tokens live in `src/constants/` (`spacing`, `colors`, `typography`, `ui`).
  Tailwind mirrors them from the same primitive pool in `tailwind.config.js`.

## Scenario system

This kit's killer feature. Every prototype variant is a `Scenario` registered
in `src/prototype/scenarios.tsx`:

```tsx
{ id: 'home-v2', label: 'Home — V2', tab: 'Home', component: HomeV2 }
```

- One scenario can be active per tab. Active selections persist via
  `localStorage` on web (native persistence is a no-op for now — add
  `@react-native-async-storage/async-storage` when you need it).
- Profile → Scenarios renders one section per tab with all registered
  variants. Tap to activate, tap again to clear.
- **`src/prototype/_template/ScenarioTemplate.tsx`** is the canonical
  starter. Never import it into `scenarios.tsx` — the leading underscore
  signals "designer-facing example only". When asked to scaffold a new
  scenario, copy this file rather than writing one from scratch.
- **Web stakeholder browse:** `/scenarios` (also Profile → Scenarios
  index on web) lists every registered variant with an "Open" link.
  Hidden on native. Useful for sharing the whole prototype with a PM.
- Deep-link a specific variant with `?scenario=<id>` in the web URL.
  Useful for sharing a single Home concept with PM/CEO.

## State

- **Module-level store + `useSyncExternalStore` hook** is the kit's
  preferred state pattern. The scenario store
  (`src/prototype/scenarios.tsx`) is the reference implementation —
  copy it for any new prototype state.
- **React Context** for ambient app state — `NotificationsContext`,
  `WatchlistContext`, `DisplayCurrencyContext`, `ThemeContext`,
  `AppScrollContext`, `TabChromeContext`.

## Navigation

- **Flat `RootStackParamList`** in `src/navigation/RootNavigator.tsx` —
  `Main` (tabs), `Profile`, `Theme`, `Styles`. Add prototype-specific
  routes here as needed.
- **Tab screens are scenario routers** — `HomeScreen`, `PortfolioScreen`,
  `TradeScreen`, `MarketplaceScreen` each delegate to `<TabScreen tab="..." />`
  which looks up the active scenario and renders it, or an empty
  placeholder.
- Multi-step flows inside a scenario should use internal `useState<Step>`
  rather than one stack route per step (keeps each variant self-contained).

## Web export to Figma

When the user asks to "send / export / capture screens to Figma":

1. **Always pause first** and ask the user to confirm Chrome DevTools is
   in mobile-preview mode (Cmd+Shift+M → iPhone 15 Pro 393×852 or iPhone X
   375×812). Without this, captures land at desktop width.
2. Wait for an explicit confirmation before starting any capture.
3. Drive captures via `generate_figma_design` + `window.figma.captureForDesign`.
4. See `WEB_EXPORT.md` for the full workflow.

### Discovery rules for `use_figma` rebuilds

a) **Theme-aware variables only.** Prefer
   `background/neutral/primary/default` over the explicit-mode variants
   (`background/neutral/dark/...`). The dark/light flavour is what the
   theme mode resolves to.

b) **Set the frame's theme mode** before binding any colour variables.
   Use `frame.setExplicitVariableModeForCollection(collection, modeId)`
   targeting the `🎨 Theme →` collection from `Style Library - Universal`.

c) **Search before placeholding.** For every visible UI primitive, run
   `search_design_system` against `Component Library` first.

d) **Clone content assets, don't recreate them.** Images, custom
   illustrations, brand SVGs: clone from the raw capture via
   `figma.getNodeByIdAsync(rawId).clone()`.

## Publish workflow (Expo Go via EAS Update)

When asked to "publish to Expo Go" / "push an update":

1. Prefer **`npm run share -- "<short summary>"`** — wraps `eas update`,
   parses the Update Group ID, and prints the deep link ready to share.
   Defined in `scripts/share.sh`.
2. If running EAS directly, capture the **Update group ID** from CLI
   output and assemble the link in the form:

   ```
   exp://u.expo.dev/<projectId>/group/<updateGroupId>
   ```

   `<projectId>` lives in `app.json` under `expo.extra.eas.projectId`
   (set this on first publish via `npx eas project:init`).

3. Do **not** return the bare `https://u.expo.dev/<projectId>` URL —
   that endpoint 400s in a browser.

## Dev surfaces

Two sister screens, both reachable from Profile and both sharing the
same `<DevKitSection>` filter pattern:

- **`src/screens/ComponentsScreen.tsx`** (route `Components`,
  URL `/components`) — live preview of every shared component, with
  interactive demos and a one-line API hint per section. Add a
  `DevKitSection` here whenever a new shared component lands.
- **`src/screens/StylesScreen.tsx`** (route `Styles`, URL `/styles`)
  — design tokens (colors / spacing / radius / typography / Satoshi
  family) and icon catalogs (CryptoIcon, GlassIcon, PremiumIcon).
  Every swatch / row / icon tile is tap-to-copy via `expo-clipboard`
  + a Toast. Add a section here whenever a new token category lands.

Both screens import the *real* shared components / tokens, so any DS
edit shows up automatically — no separate fixture to maintain. Each
`<DevKitSection>` takes optional `aliases` for keyword search ("toggle"
→ Switch, "graph" → LineChart).

## Setup safety net

`scripts/check-setup.js` runs on `prestart` and warns (non-fatal) when
`package.json` `name` / `app.json` `expo.name|slug|extra.eas.projectId`
still match the kit defaults. The kit itself ships a `.kit-template`
sentinel file that silences the check — forks delete it as part of the
After-cloning step in README.

## Sharing

Prefer **`npm run share -- "<message>"`** over raw `eas update`. The
script lives at `scripts/share.sh` and prints the canonical
`exp://u.expo.dev/<projectId>/group/<id>` link on the last line.
