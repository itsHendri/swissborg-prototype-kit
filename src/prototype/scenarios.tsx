import { useSyncExternalStore, type ComponentType } from 'react';
import { Platform } from 'react-native';
import type { TabParamList } from '../navigation/TabNavigator';

export type TabKey = keyof TabParamList;

export type Scenario = {
  id: string;
  label: string;
  description?: string;
  tab: TabKey;
  component: ComponentType;
};

// ─── Registered scenarios ───────────────────────────────────────────────────
// Add a Scenario object here to make a variant appear in Profile → Scenarios.
// Group entries by `tab` so the picker reads naturally.

export const scenarios: Scenario[] = [
  // Example — uncomment and adapt for each prototype variant.
  // {
  //   id: 'home-v1',
  //   label: 'Home — Current',
  //   description: 'Existing home dashboard',
  //   tab: 'Home',
  //   component: HomeV1,
  // },
];

// ─── Active-scenario store (one active scenario per tab) ────────────────────

const STORAGE_KEY = 'prototype:activeScenarios';

type ActiveMap = Partial<Record<TabKey, string>>;

function loadInitial(): ActiveMap {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as ActiveMap;
    } catch {/* ignore */}
  }
  return {};
}

let active: ActiveMap = loadInitial();
const listeners = new Set<() => void>();

function persist() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
    } catch {/* ignore */}
  }
}

export function setActiveScenario(tab: TabKey, id: string | undefined): void {
  const next: ActiveMap = { ...active };
  if (id == null) delete next[tab];
  else next[tab] = id;
  active = next;
  persist();
  listeners.forEach(l => l());
}

export function getActiveScenarioId(tab: TabKey): string | undefined {
  return active[tab];
}

export function getActiveMap(): ActiveMap {
  return active;
}

function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

/** Subscribe to the active-scenario id for a single tab. */
export function useActiveScenarioId(tab: TabKey): string | undefined {
  return useSyncExternalStore(
    subscribe,
    () => active[tab],
    () => active[tab],
  );
}

/** Resolve the active Scenario object for a tab, or undefined if none picked. */
export function useActiveScenario(tab: TabKey): Scenario | undefined {
  const id = useActiveScenarioId(tab);
  if (!id) return undefined;
  return scenarios.find(s => s.id === id && s.tab === tab);
}

export function scenariosForTab(tab: TabKey): Scenario[] {
  return scenarios.filter(s => s.tab === tab);
}

/**
 * On web boot, honour `?scenario=<id>` by activating it for whichever tab
 * it belongs to. Useful for shareable deep-links and Figma flow captures.
 */
export function applyScenarioFromUrl(): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const id = url.searchParams.get('scenario');
  if (!id) return;
  const match = scenarios.find(s => s.id === id);
  if (match) setActiveScenario(match.tab, match.id);
}
