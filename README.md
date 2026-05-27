# SwissBorg Prototype Kit

A React Native + Expo **starter template** for spinning up mobile prototype
concepts fast. Keeps the design system, navigation shell, and component
library; ships with empty screens and a scenario picker.

> **This is a template, not a prototype container.** Don't build prototypes
> inside this repo — each prototype gets its own fork. Keep `scenarios.tsx`
> empty on `main` so the kit stays light.

## Starting a new prototype

**Preferred — GitHub Template:**
1. Click "Use this template" → name it `proto-<concept>` → Create.
2. `gh repo clone itsHendri/proto-<concept> && cd proto-<concept>`
3. Run the **After cloning** checklist below.
4. `npm install && npx expo start` (then press `i` for the iOS Simulator).
5. Build variants in `src/prototype/`, register them in
   `src/prototype/scenarios.tsx`, ship via `npm run share`.

**Local-filesystem alternative:**
```sh
cp -R swissborg-prototype-kit proto-<concept>
cd proto-<concept>
rm -rf .git node_modules dist
git init && npm install
# then follow the After cloning checklist below
```

Changes to the design system, shared components, or scenario system flow
*back* into the kit. Changes to a specific prototype's variants stay in
the prototype's fork.

## After cloning

Five-minute checklist for a freshly-forked prototype:

1. **Delete `.kit-template`** — its presence silences the setup-check
   warning. Once removed, `npm start` will nag you about anything still
   set to the kit's defaults.
2. **`package.json`** → set `"name"` to your prototype's slug.
3. **`app.json`** → set `expo.name` (shown under the icon) and
   `expo.slug`.
4. **`npx eas project:init`** (one-time) → writes `expo.extra.eas.projectId`
   and `expo.updates.url` back into `app.json`. Required before
   `npm run share` can publish.
5. **`npm install && npx expo start`**, press `i`. If Expo prompts
   "Install the recommended Expo Go version?" and the fetch fails, type
   **`n`** — the existing Expo Go on the Simulator is compatible.

## What's in the box

- **Navigation shell** — 4-tab bottom bar (Home / Portfolio / Trade / Marketplace),
  floating glass header, Profile push, full-screen Dev Kit modal.
- **Design system** — colour, typography, spacing, radius tokens in
  `src/constants/`. Mirror in `tailwind.config.js`. See `DESIGN_SYSTEM.md`.
- **~42 shared components** — primitives (Button, Card, ListRow,
  BottomSheet, TextField, StickyBottomBar, PageTitleBar), charts &
  numbers (LineChart, HeroBalance, PercentChange, ProgressBar,
  TimeRangePicker), feedback (Toast, EmptyState, SuccessScreen,
  ShimmerGrid), forms (Switch, OtpInput, AmountInput, UploadTile),
  flow scaffolding (Stepper, QuoteCard, StatusTimeline, Accordion),
  iconography (GlassIcon, PremiumIcon, CryptoIcon), plus the
  `useHaptic` hook and `BalanceVisibility` context.
- **Scenario system** — register variants of any tab in
  `src/prototype/scenarios.tsx`. Activate via Profile → Scenarios, or via
  `?scenario=<id>` URL param on web.
- **Two dev surfaces** under Profile, each with its own sticky search:
  - **Components** — live preview of every shared component, with
    interactive demos and a one-line API hint per section.
  - **Styles** — design tokens (colors, spacing, radius, typography,
    Satoshi family) and icon assets (Crypto, Glass, Premium). Every
    swatch / row / icon tile is tap-to-copy.
- **Scenarios index** (web only, `/scenarios` or Profile → Scenarios
  index) — flat list of every registered variant for stakeholder
  browsing without touching the Profile picker.
- **Web export to Figma** — see `WEB_EXPORT.md`.

## Run it

```sh
npm install
npx expo start    # canonical — pick the target interactively
```

`npx expo start` boots Metro and then waits for a single keystroke to
pick the target: **`i`** iOS Simulator, **`a`** Android, **`w`** web,
**`j`** debugger, **`r`** reload, **`m`** toggle dev menu. This is the
preferred entry point because the same Metro instance can serve every
target — no need to restart when you switch.

**Expo Go on the iOS Simulator is the canonical preview surface** —
that's `i` from the prompt. The web target (`w`) exists so screens can
be captured back into Figma (see `WEB_EXPORT.md`); it's not the intended
preview for design or stakeholder review.

The shortcut scripts (`npm run ios`, `npm run web`, `npm run android`)
still exist for muscle memory, but they're just `expo start --<target>`
under the hood and skip the interactive prompt.

### First-run on the iOS Simulator

If Expo prompts **"Install the recommended Expo Go version?"** and the
download fails with `TypeError: fetch failed`, type **`n`** (not Enter —
the default is `yes`). The Expo Go already on the Simulator is
compatible; only the auto-upgrade is failing.

## First scenario in 60 seconds

1. **Copy the template:** `cp -R src/prototype/_template src/prototype/home`,
   then rename `ScenarioTemplate.tsx` → `HomeV1.tsx` and rename the
   exported function to match.
2. **Edit `HomeV1.tsx`** — the file already wires up `ShimmerGrid`,
   `PageTitleBar`, an `Animated.ScrollView` with the right insets, and a
   sample `Button`/`Card`. Replace the body.
3. **Register it** in `src/prototype/scenarios.tsx`:

   ```tsx
   import { HomeV1 } from './home/HomeV1';

   export const scenarios: Scenario[] = [
     { id: 'home-v1', label: 'Home — V1', tab: 'Home', component: HomeV1 },
   ];
   ```

4. **Open Profile → Scenarios** in the running app and tap your variant.
   The Home tab renders it.

`src/prototype/_template/` is a copy-this-file starter — never imported
into `scenarios.tsx`, so it stays invisible in the picker.

To share one variant directly, append `?scenario=home-v1` to the web
URL or — on web — open `/scenarios` (the stakeholder browse surface;
also reachable from Profile → Scenarios index on web).

## Publish to Expo Go (EAS Update)

```sh
npm run share -- "Short summary of the update"
```

`scripts/share.sh` wraps `eas update`, parses the Update Group ID, and
prints the deep link in the canonical form:

```
exp://u.expo.dev/<projectId>/group/<updateGroupId>
```

Paste that into Slack / email and the recipient opens it directly in
Expo Go. The bare `https://u.expo.dev/...` URL 400s in a browser — Expo
Go expects the `group/` form.

Prerequisites: `eas whoami` shows you're logged in, and
`expo.extra.eas.projectId` is present in `app.json` (one-time
`npx eas project:init` after cloning).

## Repo layout

```
App.tsx                       providers, NavigationContainer, scenario URL bootstrap
src/
├── components/
│   ├── AppHeader.tsx         avatar + title row above the tabs
│   ├── BottomTabBar.tsx
│   └── shared/               design-system component library
├── constants/                colour / spacing / typography / radius tokens
├── context/                  Theme, AppScroll, TabChrome, Notifications, …
├── data/                     minimal mock seed
├── navigation/
│   ├── RootNavigator.tsx     Main + Profile + Theme + Styles
│   ├── TabNavigator.tsx      Home / Portfolio / Trade / Marketplace
│   └── entries.ts
├── prototype/
│   ├── scenarios.tsx         register variants here
│   └── _template/            copy-this-file starter (ignored by picker)
└── screens/
    ├── HomeScreen / PortfolioScreen / SwapScreen / MarketplaceScreen
    │                         thin scenario routers
    ├── TabScreen.tsx         shared router shell + empty placeholder
    ├── MainLayout.tsx        floating header + tab content
    ├── ProfileScreen.tsx     Scenarios picker + dev surface links
    ├── ThemeScreen.tsx
    ├── ComponentsScreen.tsx  live shared-component preview
    ├── StylesScreen.tsx      design tokens + asset catalog
    └── ScenariosIndexScreen.tsx  web-only stakeholder browse
scripts/
├── check-setup.js            prestart sanity check (slug, EAS projectId)
└── share.sh                  `npm run share -- "<msg>"` → Expo Go deep link
```
