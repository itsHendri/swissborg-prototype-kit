# SwissBorg Prototype Kit

A React Native + Expo **starter template** for spinning up mobile prototype
concepts fast. Keeps the design system, navigation shell, and component
library; ships with empty screens and a scenario picker.

> **This is a template, not a prototype container.** Don't build prototypes
> inside this repo — each prototype gets its own fork. Keep `scenarios.tsx`
> empty on `main` so the kit stays light.

## Starting a new prototype

**Preferred — GitHub Template:**
1. On the GitHub repo, Settings → check "Template repository".
2. Click "Use this template" → name it `proto-<concept>` → "Create repository".
3. `gh repo clone itshendri/proto-<concept> && cd proto-<concept>`
4. Edit `package.json` `name` + `app.json` `name`/`slug` to match.
5. `npm install && npx expo start --web`
6. Build variants in `src/prototype/`, register them in
   `src/prototype/scenarios.tsx`, ship via `eas update`.

**Local-filesystem alternative:**
```sh
cp -R swissborg-prototype-kit proto-<concept>
cd proto-<concept>
rm -rf .git node_modules dist
# manually update package.json + app.json slugs
git init && npm install
```

Changes to the design system, shared components, or scenario system flow
*back* into the kit. Changes to a specific prototype's variants stay in
the prototype's fork.

## What's in the box

- **Navigation shell** — 4-tab bottom bar (Home / Portfolio / Trade / Marketplace),
  floating glass header, Profile push, full-screen Dev Kit modal.
- **Design system** — colour, typography, spacing, radius tokens in
  `src/constants/`. Mirror in `tailwind.config.js`. See `DESIGN_SYSTEM.md`.
- **~28 shared components** — Button, Card, ListRow, BottomSheet, TextField,
  StickyBottomBar, PageTitleBar, GlassIcon, PremiumIcon, CryptoIcon,
  PagerDots, ShimmerGrid, EmptyState, SuccessScreen, and more.
- **Scenario system** — register variants of any tab in
  `src/prototype/scenarios.tsx`. Activate via Profile → Scenarios, or via
  `?scenario=<id>` URL param on web.
- **Dev Kit screen** (Profile → Dev Kit) — live preview of every shared
  component + design token.
- **Web export to Figma** — see `WEB_EXPORT.md`.

## Run it

```sh
npm install
npx expo start --web    # browser, fastest iteration
npx expo start --ios    # iOS simulator via Expo Go
```

## Add a prototype variant

1. Build the variant as a React component anywhere under `src/prototype/`
   (e.g. `src/prototype/home/HomeV2.tsx`).
2. Register it in `src/prototype/scenarios.tsx`:

   ```tsx
   import { HomeV2 } from './home/HomeV2';

   export const scenarios: Scenario[] = [
     { id: 'home-v2', label: 'Home — V2 (portfolio-led)', tab: 'Home', component: HomeV2 },
   ];
   ```

3. Open Profile → Scenarios, tap the variant, and the Home tab renders it.

To share a specific variant directly, append `?scenario=home-v2` to the web
URL or use it inside an Expo Go deep-link.

## Publish to Expo Go (EAS Update)

1. Create an EAS project: `npx eas project:init` (writes
   `extra.eas.projectId` + the `updates.url` back into `app.json`).
2. Ship an update: `eas update --branch main --message "<summary>"`.
3. Share the deep-link in the form
   `exp://u.expo.dev/<projectId>/group/<updateGroupId>` (the bare
   `https://u.expo.dev/...` URL 400s in a browser — Expo Go expects the
   group form).

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
│   └── scenarios.tsx         register variants here
└── screens/
    ├── HomeScreen / PortfolioScreen / SwapScreen / MarketplaceScreen
    │                         thin scenario routers
    ├── TabScreen.tsx         shared router shell + empty placeholder
    ├── MainLayout.tsx        floating header + tab content
    ├── ProfileScreen.tsx     Scenarios picker + dev surface links
    ├── ThemeScreen.tsx
    └── StylesScreen.tsx      Dev Kit
```
