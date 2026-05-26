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

## Architecture

- **React Native + Expo SDK ~54**, iOS-first, tested on Simulator via Expo Go.
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

1. Run `eas update --branch main --message "<short summary>" --non-interactive`.
2. Capture the **Update group ID** from the CLI output.
3. Return the deep-link in this exact format so it opens in Expo Go:

   ```
   exp://u.expo.dev/<projectId>/group/<updateGroupId>
   ```

   `<projectId>` lives in `app.json` under `expo.extra.eas.projectId`
   (set this on first publish via `npx eas project:init`).

4. Do **not** return the bare `https://u.expo.dev/<projectId>` URL —
   that endpoint 400s in a browser.

## Dev Kit (`src/screens/StylesScreen.tsx`)

Preview surface for design tokens and components — useful for regressions.
Imports the real shared components, so any DS edit shows up here
automatically.
