# Web Export to Figma

When and how to send prototype screens to Figma so designers can clean them up.

> **The web build exists for this purpose only.** It is not a production target.
> Native (Expo Go on iOS) is the source of truth for the prototype.

## When to export

Whenever a feature or screen is ready for design review or polish. The typical
case: feature complete in RN, hand it to designers for finishing touches in
Figma.

## What's already in place

The repository ships ready for web export — no per-export setup needed:

- **Web dependencies** (`react-dom`, `react-native-web`, `@expo/metro-runtime`)
  in `package.json`. Dev-only — never bundled into iOS/Android binaries.
- **Figma capture script** auto-injected on web via [`App.tsx`](App.tsx). Gated
  by `Platform.OS === 'web'` so native is untouched.
- **Focus-gated tabs on web** via [`src/navigation/TabNavigator.tsx`](src/navigation/TabNavigator.tsx).
  Each bottom-tab screen returns `null` when not focused on web, so only one
  tab's DOM exists at a time. No-op on native.

Native build is byte-for-byte identical to a setup without these — verify with
`npx expo start` (no `--web`).

## Per-export workflow (~5–10 minutes)

### 1. Start the web dev server

```bash
npx expo start --web --port 8082
```

Wait for `Web Bundled` in the output. Server runs at `http://localhost:8082`.

If you need a different port, pass `--port <n>`. If 8082 is occupied, kill the
old process first: `lsof -i :8082` then `kill <PID>`.

### 2. Open the page in Chrome — **and switch to mobile preview**

Navigate to `http://localhost:8082`. Then **toggle DevTools device emulation
to a mobile viewport** so captures land at iPhone proportions (otherwise
RN-Web's liquid layouts stretch every screen to whatever the desktop window
width is, producing 1400+ px-wide Figma frames).

1. **Cmd + Option + I** → DevTools
2. **Cmd + Shift + M** → toggles the device toolbar
3. Top dropdown → pick **iPhone 15 Pro** (393 × 852) or **iPhone X** (375 × 812)
4. Refresh the page — RN-Web will now render at the mobile viewport

> **Don't skip this step.** Captures taken at desktop width are unusable for
> design hand-off because the layout doesn't match the iOS reality. There's
> no Platform.web hard-cap in the codebase (we tried; RN-Web's `Dimensions`
> reads `window.innerWidth` at module init, which makes a clean override
> brittle). Manual DevTools preview is the cleanest path.

Then verify the capture script loaded by opening DevTools → Console:

```js
document.querySelector('script[data-figma-capture]')
// → <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" ...>
```

If `null`, the script tag didn't inject — restart the dev server with
`--clear`.

### 3. Authenticate the Figma MCP (one-time per Claude session)

In Claude Code, ask:

> "authenticate Figma MCP"

Claude returns an OAuth URL. Open it, click Authorise. The browser redirects
to a `localhost:55666/callback?...` URL — if it fails to load (common), copy
the full URL from the address bar and paste back to Claude. Claude calls
`complete_authentication` with it. After this, the real Figma write tools
become available.

### 4. Send screens to Figma

> **Pre-flight:** before any capture, confirm DevTools is in mobile-preview
> mode (step 2). When asked to export, Claude **must** pause and confirm
> this with you before sending anything to Figma — see the CLAUDE.md rule.

Two routes:

**Manual (browser-driven):** the capture script renders a small toolbar on
each page in Chrome — one click recaptures the current screen. Best for
ad-hoc browsing through the app.

**Programmatic (Claude-driven):** ask Claude to send specific screens to a
specific Figma destination, providing the Figma URL so Claude knows the
target. Example:

> "send the Vaults dashboard screen to https://www.figma.com/design/UkTGR4vIC7wTeo3GSj44Zk/Invest-📲-DEV?node-id=13130-75960"

Claude will:
1. **Pause and ask** whether DevTools is set to a mobile preview before
   starting any capture — answering "yes / ready" is the signal to begin.
2. Resolve the file key + node ID from the Figma URL.
3. Call `generate_figma_design` against `localhost:8082`, fire the
   capture via the page's `window.figma.captureForDesign`, and poll until
   the capture completes.
4. Repeat per screen.

For batch sweeps, give Claude the route list upfront.

### 5. (Optional) Rebuild captures with design-system components

Captures land as **raw frames** (rectangles + text + images, no component
instances). To replace them with real components from the SwissBorg Figma
libraries, ask Claude:

> "rebuild the captured Vaults dashboard with design system components"

Claude calls `search_design_system` against the libraries subscribed to the
target file (Component Library, Invest 📲 DEV, Token Asset Library, etc.),
then `use_figma` to swap raw frames for component instances. Delete the
original raw capture once the rebuilt version is approved.

This step is slower (~1–2 min per screen) but produces componentised Figma
output rather than dead pixels.

## Canonical screen list

Walk these in order if you want a complete capture sweep. Pre-seed any state
via the Styles screen dev controls before capturing (e.g. seed a demo vault
so the dashboard isn't empty).

**Tabs:**
- Home (`/`)
- Accounts / Portfolio
- Trade
- Discover / Marketplace

**Loans flow** (tap loans banner on Home, or use Styles → Loans dev controls
to set status):
- Loans intro slider (slides 1 + 2)
- Create Loan Account (terms + success)
- Borrow (collateral, review, success)
- Loan Dashboard (active-loan state)
- Repay
- Add Collateral
- Liquidation Alert (force via Styles → SOL price override `$78`)

**Vaults flow** (tap Savings Vaults banner on Home; pre-seed via Styles →
Vaults dev controls):
- Vaults intro slider (slides 1 + 2)
- Create Vault — Goal step (with preset, with skip)
- Create Vault — Deposit step (with amount filled)
- Create Vault — Recurring step
- Create Vault — Review step
- Create Vault — Success
- Vaults Dashboard (with seeded vault)
- Vault Detail
- Edit Recurring
- Vault Deposit (top-up + withdraw modes)

**Detail screens:**
- Asset Detail (BTC, ETH, USDC, BORG, SOL — pick one)
- Inbox
- Send / Receive / Pay / Top Up Card
- Stake

**Dev surfaces:**
- Styles screen (useful for capturing the design system tokens themselves)

Add to / refresh this list when navigation changes.

## Known web-only quirks

These are cosmetic and acceptable for capture. Don't fix unless they break
layout fidelity.

| Symptom | Cause | Impact |
|---|---|---|
| `BlurView` renders flat black | RN-Web doesn't implement `expo-blur` | PageTitleBar / AppHeader denser than iOS. Capture anyway, rebuild blur in Figma. |
| `PremiumIcon` doesn't loop | Animated.loop with native driver | Captures freeze at start position. Fine. |
| `LTV slider` drag feels different | PanResponder on web | Static capture is unaffected. |
| `Haptics` no-op | `expo-haptics` web stub | Silent. |
| Font weight slightly off | Some `.otf` weights load oddly on web | Spot-check; usually fine. |
| Asset 404 with `+` / `&` / `#` in name | Metro's web asset resolver decodes URL chars | Rename the asset (no special chars). One-time fix per file. |

If a new screen's web rendering is broken in a layout-affecting way (text
clipped, content overflowing, layout collapsed), patch it before exporting —
it'll save designer time downstream.

## What this affects on native

**Nothing.** Every web-only behaviour is gated:

- `App.tsx` script injection: `Platform.OS === 'web'` short-circuits before
  touching `document` (which is undefined on native anyway).
- `TabNavigator` focus gate: `gateByFocusWeb` returns the component unchanged
  on native — no HOC, no extra render, no state loss across tab switches.
- Web deps: never imported by native bundles. Metro's platform-aware module
  resolution skips them.

Run `npx expo start` (no `--web`) for normal iOS development. EAS Update
publishes are unaffected.

## Refreshing this doc

- Add / remove screens from the canonical list when navigation changes.
- Add a row to the "Known web-only quirks" table when you find new ones.
- Update the OAuth instructions if the Figma MCP flow changes.
- If you change the web export setup itself (e.g. switch off the focus-gate
  HOC for a different approach), update **What's already in place**.
